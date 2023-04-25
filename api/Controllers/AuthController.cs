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
                LocationReminderIDs = new List<string>()
            };

            await _dbContext.SaveAsync<AppUser>(user);

            return new OkObjectResult(new LoginResponseDTO()
            {
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Username = user.Username,
                Email = user.Email,
                Token = _tokenSerivce.CreateToken(user.Username)
            }); ;
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
                Token = _tokenSerivce.CreateToken(user.Username)
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

        [HttpGet("token/{username}")]
        public async Task<ActionResult> GenerateToken(string username)
        {
            var token = _tokenSerivce.CreateToken(username);
            return new OkObjectResult(new
            {
                value = token
            }) ;
        }

    }
}

