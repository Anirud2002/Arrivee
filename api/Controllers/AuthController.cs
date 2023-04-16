using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
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
        private readonly ITokenService _tokenSerivce;
        public AuthController(IDynamoDBContext context, ITokenService tokenService)
        {
            _dbContext = context;
            _tokenSerivce = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(registerDTO.UserName);
            ArgumentNullException.ThrowIfNullOrEmpty(registerDTO.FirstName);
            ArgumentNullException.ThrowIfNullOrEmpty(registerDTO.LastName);
            ArgumentNullException.ThrowIfNullOrEmpty(registerDTO.Email);
            ArgumentNullException.ThrowIfNullOrEmpty(registerDTO.Password);

            if (await UserExists(registerDTO.UserName))
            {
                return new BadRequestObjectResult(new
                {
                    message = "UserName already taken!"
                });
            }
            // hashing and salting password
            using var hmac = new HMACSHA512();
            var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
            var passwordSalt = hmac.Key;

            // storing the user in database
            var user = new AppUser()
            {
                UserName = registerDTO.UserName,
                FirstName = registerDTO.FirstName,
                LastName = registerDTO.LastName,
                Email = registerDTO.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                LocationReminderIDs = new List<string>()
            };

            await _dbContext.SaveAsync<AppUser>(user);

            return new OkObjectResult(new LoginResponseDTO()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenSerivce.CreateToken(user.UserName)
            }); ;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(loginDTO.UserName);
            ArgumentNullException.ThrowIfNullOrEmpty(loginDTO.Password);

            var user = await _dbContext.LoadAsync<AppUser>(loginDTO.UserName);
            if(user == null)
            {
                return new BadRequestObjectResult(new
                {
                    message = "Invalid Credentials!"
                });
            }

            // checking the password
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var validateHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

            for(var i = 0; i < validateHash.Length; i++)
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
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenSerivce.CreateToken(user.UserName)
            }); ;

        }

        [HttpGet("check-username/{username}")]
        public async Task<ActionResult> CheckUsername(string userName)
        {
            if (await UserExists(userName))
            {
                return new OkObjectResult(false);
            }

            return new OkObjectResult(true);
        }

        public async Task<bool> UserExists(string userName)
        {
            var user = await _dbContext.LoadAsync<AppUser>(userName);
            return user != null;
        }
    }
}

