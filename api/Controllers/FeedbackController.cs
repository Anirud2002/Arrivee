using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using api.DTOs;
using api.Extensions;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
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

        [HttpPost("send-email")]
        public async Task<ActionResult> SendFeedback([FromBody] FeedbackDTO feedbackDTO)
        {
            ArgumentNullException.ThrowIfNull(feedbackDTO.Username);
            ArgumentNullException.ThrowIfNull(feedbackDTO.Email);
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
                    //message = "Couldn't send feedback!"
                    message = e
                }) ;
            };

            return new OkResult();
        }
    }
}

