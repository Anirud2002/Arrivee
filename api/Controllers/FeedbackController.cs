using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using api.DTOs;
using api.Extensions;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class FeedbackController : Controller
    {
        private readonly IDynamoDBContext _dbContext;
        private readonly IEmailService _emailService;

        public FeedbackController(IDynamoDBContext dBContext, IEmailService emailService)
        {
            _dbContext = dBContext;
            _emailService = emailService;
        }

        [HttpPost("send-feedback")]
        public async Task<ActionResult> SendFeedback([FromBody] FeedbackDTO feedbackDTO)
        {
            ArgumentNullException.ThrowIfNull(feedbackDTO.Username);
            ArgumentNullException.ThrowIfNull(feedbackDTO.FirstName);
            ArgumentNullException.ThrowIfNull(feedbackDTO.LastName);
            ArgumentNullException.ThrowIfNull(feedbackDTO.Feedback);


            if (!User.Exists(feedbackDTO.Username))
            {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            try
            {
                await _emailService.SendEmailAsync(feedbackDTO.FirstName, feedbackDTO.LastName, feedbackDTO.Feedback, feedbackDTO.Stars);
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult(new
                {
                    operationSuccess = false,
                    message = "Counldn't send feedback!"
                }) ;
            };

            return new OkObjectResult(new
            {
                operationSuccess = true
            });
        }
    }
}

