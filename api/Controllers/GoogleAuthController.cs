using System;
using System.Collections.Generic;
using System.Linq;
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
    public class GoogleAuthController : Controller
    {
        private readonly IDynamoDBContext _dbContext;
        private readonly ITokenService _tokenService;
        public GoogleAuthController(IDynamoDBContext dbContext, ITokenService tokenService)
        {
            _dbContext = dbContext;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult> GoogleSignIn([FromBody] GoogleSignInDTO googleSignInDTO)
        {
            ArgumentNullException.ThrowIfNull(googleSignInDTO.Firstname);
            ArgumentNullException.ThrowIfNull(googleSignInDTO.Lastname);
            ArgumentNullException.ThrowIfNull(googleSignInDTO.Email);

            var googleUser = await _dbContext.LoadAsync<GoogleUser>(googleSignInDTO.Email);

            if(googleUser == null) // means users doesn't exists, so we need to register them
            {
                Random random = new Random();
                var randomUsername = "user" + random.Next(1000, 9999);
                var user = new AppUser()
                {
                    Username = randomUsername,
                    Firstname = googleSignInDTO.Firstname,
                    Lastname = googleSignInDTO.Lastname,
                    Email = googleSignInDTO.Email,
                    PasswordHash = Guid.NewGuid().ToByteArray(),
                    PasswordSalt = Guid.NewGuid().ToByteArray(),
                    LocationReminderIDs = new List<string>(),
                    NotificationIDs = new List<string>(),
                    IsGoogleUser = true,
                };

                var newGoogleUser = new GoogleUser()
                {
                    Email = googleSignInDTO.Email,
                    Username = randomUsername
                };

                await _dbContext.SaveAsync<AppUser>(user); // save new user to Main table
                await _dbContext.SaveAsync<GoogleUser>(newGoogleUser); // save new google user to Google User table
                return new OkObjectResult(new LoginResponseDTO()
                {
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Username = user.Username,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user.Username)
                });
            }
            else
            {
                var user = await _dbContext.LoadAsync<AppUser>(googleUser.Username);
                return new OkObjectResult(new LoginResponseDTO()
                {
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Username = user.Username,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user.Username)
                }); ;
            }

        }

        public async Task<bool> UserExists(string userName)
        {
            var user = await _dbContext.LoadAsync<AppUser>(userName);
            return user != null;
        }
    }
}

