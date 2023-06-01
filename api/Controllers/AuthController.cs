using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using api.DTOs;
using api.Entities;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IDynamoDBContext _dbContext;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        public AuthController(IDynamoDBContext context, ITokenService tokenService, IEmailService emailService)
        {
            _dbContext = context;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            ArgumentNullException.ThrowIfNull(registerDTO.Username);
            ArgumentNullException.ThrowIfNull(registerDTO.Firstname);
            ArgumentNullException.ThrowIfNull(registerDTO.Lastname);
            ArgumentNullException.ThrowIfNull(registerDTO.Email);
            ArgumentNullException.ThrowIfNull(registerDTO.Password);

            if (await UserExists(registerDTO.Username))
            {
                return new BadRequestObjectResult(new
                {
                    message = "Username already taken!"
                });
            }
            // hashing and salting password
            using var hmac = new HMACSHA512();
            var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
            var passwordSalt = hmac.Key;

            // storing the user in database
            var user = new AppUser()
            {
                Username = registerDTO.Username,
                Firstname = registerDTO.Firstname,
                Lastname = registerDTO.Lastname,
                Email = registerDTO.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                LocationReminderIDs = new List<string>(),
                NotificationIDs = new List<string>(),
                IsGoogleUser = false
            };

            await _dbContext.SaveAsync<AppUser>(user);

            return new OkObjectResult(new LoginResponseDTO()
            {
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Username = user.Username,
                Email = user.Email,
                Token = _tokenService.CreateToken(user.Username)
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            ArgumentNullException.ThrowIfNull(loginDTO.Username);
            ArgumentNullException.ThrowIfNull(loginDTO.Password);

            var user = await _dbContext.LoadAsync<AppUser>(loginDTO.Username);
            if (user == null)
            {
                return new BadRequestObjectResult(new
                {
                    message = "Invalid Credentials!"
                });
            }

            // checking the password
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var validateHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

            for (var i = 0; i < validateHash.Length; i++)
            {
                if (user.PasswordHash[i] != validateHash[i])
                {
                    return new BadRequestObjectResult(new
                    {
                        message = "Invalid Credentials!"
                    });
                }
            }

            return new OkObjectResult(new LoginResponseDTO()
            {
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Username = user.Username,
                Email = user.Email,
                Token = _tokenService.CreateToken(user.Username)
            }); ;

        }

        public async Task<bool> UserExists(string userName)
        {
            var user = await _dbContext.LoadAsync<AppUser>(userName);
            return user != null;
        }

        // used during login/register
        [HttpGet("check-username/{username}")]
        public async Task<ActionResult> CheckUsername(string userName)
        {
            if (await UserExists(userName))
            {
                return new OkObjectResult(false);
            }

            return new OkObjectResult(true);
        }


        [HttpGet("verify-account/{username}")]
        public async Task<ActionResult> SendVerficationCode(string username)
        {
            ArgumentNullException.ThrowIfNull(username);

            var user = await _dbContext.LoadAsync<AppUser>(username);
            if(user == null)
            {
                return new BadRequestObjectResult(new
                {
                    operationSuccess = false,
                    message = "Username doesn't exists"
                }) ;
            }

            Random random = new Random();
            var newVerficationCode = random.Next(10000, 99999);

            if (!string.IsNullOrEmpty(user.VerificationCodeAndExpireTime))
            {
                var prevVerificationCode = user.VerificationCodeAndExpireTime.Split("-")[0];
                while(string.Equals(prevVerificationCode, newVerficationCode))
                {
                    newVerficationCode = random.Next(10000, 99999);
                }
            }

            long expiringTime = DateTime.Now.Millisecond + (30 * 60 * 1000); // 30 minutes for this code to expire
            var vertificationCodeAndExpireTime = newVerficationCode + "-" + expiringTime;

            user.VerificationCodeAndExpireTime = vertificationCodeAndExpireTime;
            await _dbContext.SaveAsync<AppUser>(user);

            await _emailService.SendVerificationCodeAsync(newVerficationCode, user.Email);

            return new OkObjectResult(new
            {
                operationSuccess = true
            });

        }

        [HttpGet("verify-code/{username}/{code}")]
        public async Task<ActionResult> VerifyCode(string username, int code)
        {
            ArgumentNullException.ThrowIfNull(username);
            ArgumentNullException.ThrowIfNull(code);

            var user = await _dbContext.LoadAsync<AppUser>(username);
            int userCode = int.Parse(user.VerificationCodeAndExpireTime.Split("-")[0]);
            long userCodeExpiringTime = long.Parse(user.VerificationCodeAndExpireTime.Split("-")[1]);

            long currentTime = DateTime.Now.Millisecond;

            if(currentTime > userCodeExpiringTime)
            {
                return new BadRequestObjectResult(new
                {
                    message = "Code already expired!"
                });
            }

            if(userCode != code) 
            {
                return new BadRequestObjectResult(new
                {
                    message = "Code didn't match!"
                });
            }

            return new OkObjectResult(true);

        }

    }
}

