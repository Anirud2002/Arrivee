using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using api.DTOs;
using api.Entities;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IDynamoDBContext _dbContext;
        public AuthController(IDynamoDBContext context)
        {
            _dbContext = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            // hashing and salting password
            using var hmac = new HMACSHA512();
            var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
            var passwordSalt = hmac.Key;

            // storing the user in database
            var user = new AppUser()
            {
                AppUserID = Guid.NewGuid().ToString(),
                FirstName = registerDTO.FirstName,
                LastName = registerDTO.LastName,
                Email = registerDTO.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                LocationReminderIDs = new List<string>()
            };

            await _dbContext.SaveAsync<AppUser>(user);
            return new OkResult();
        }
    }
}

