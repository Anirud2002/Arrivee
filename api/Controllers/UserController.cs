﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using api.DTOs;
using api.Entities;
using api.Extensions;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IDynamoDBContext _dbContext;
        private readonly ITokenService _tokenService;

        public UserController(IDynamoDBContext dbContext, ITokenService tokenService)
        {
            _dbContext = dbContext;
            _tokenService = tokenService;
        }

        // updates the user from the incoming DTO
        // if username is updated, sends new Token back
        [HttpPut("update")]
        public async Task<ActionResult> UpdateUserInfo([FromBody] UpdateUserDTO updateUserDTO)
        {
            ArgumentNullException.ThrowIfNull(updateUserDTO.Firstname);
            ArgumentNullException.ThrowIfNull(updateUserDTO.Lastname);
            ArgumentNullException.ThrowIfNull(updateUserDTO.Username);

            var username = User.GetUsername();
            var user = await _dbContext.LoadAsync<AppUser>(username);
            var updatedUser = new AppUser()
            {
                Firstname = user.Firstname,
                Lastname = user.Firstname,
                Username = user.Username,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                PasswordSalt = user.PasswordSalt,
                LocationReminderIDs = user.LocationReminderIDs,
                NotificationIDs = user.NotificationIDs,
            };

            // first check if user wants to change the password too
            if (!string.IsNullOrEmpty(updateUserDTO.OldPassword))
            {
                using var hmac = new HMACSHA512(user.PasswordSalt);
                var oldHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updateUserDTO.OldPassword));

                // check if old password matches the password user have sent from the DTO
                for (var i = 0; i < oldHash.Length; i++)
                {
                    if (user.PasswordHash[i] != oldHash[i])
                    {
                        return new BadRequestObjectResult(new
                        {
                            message = "Old password didn't match!"
                        });
                    }
                }

                // create new hash and salt for new password
                var newHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updateUserDTO.NewPassword));
                var newSalt = hmac.Key;

                // update user
                updatedUser.PasswordHash = newHash;
                updatedUser.PasswordSalt = newSalt;
            }

            // update other fields
            updatedUser.Username = updateUserDTO.Username;
            updatedUser.Firstname = updateUserDTO.Firstname;
            updatedUser.Lastname = updateUserDTO.Lastname;

            string newToken = null;

            // user needs to be deleted because primary key are immutable
            // need to change the name Identifier as well in the ClaimPrincipal
            if (!user.Username.Equals(updatedUser.Username))
            {
                await _dbContext.DeleteAsync<AppUser>(user);

                newToken = _tokenService.CreateToken(updatedUser.Username);
            }

            await _dbContext.SaveAsync<AppUser>(updatedUser);

            return new OkObjectResult(new
            {
                operationSuccess = true,
                token = newToken
            });
        }
    }
}
