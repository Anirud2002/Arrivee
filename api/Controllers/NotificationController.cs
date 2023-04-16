using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using api.DTOs;
using api.Entities;
using api.Extensions;
using Microsoft.AspNetCore.Mvc;
using SendGrid.Helpers.Mail;
using static api.Entities.Notification;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    public class NotificationController : Controller
    {

        private readonly IDynamoDBContext _dbContext;
        private readonly IAmazonDynamoDB _dbClient;

        public NotificationController(IDynamoDBContext dBContext, IAmazonDynamoDB dbClient)
        {
            _dbContext = dBContext;
            _dbClient = dbClient;
        }

        [HttpGet("get-all/{userName}")]
        public async Task<ActionResult> GetAllNotifications(string userName)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(userName);

            if (!User.Exists(userName))
            {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            QueryRequest request = new QueryRequest
            {
                TableName = "LocationReminderNotifications-Table",
                KeyConditionExpression = "UserName = :pk",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":pk", new AttributeValue { S = userName } },
                },
                Limit = 10,
                ScanIndexForward = false
            };

            // execute the query and retrieve the response
            QueryResponse items = await _dbClient.QueryAsync(request);

            // retrieve the last evaluated key from the query result
            Dictionary<string, AttributeValue> lastEvaluatedKey = items.LastEvaluatedKey;

            List<NotificationViewModel> retVal = items.Items.Select(n => new NotificationViewModel
            {
                NotificationID = n["NotificationID"].S,
                CreatedOn = long.Parse(n["CreatedOn"].N),
                LocationID = n["LocationID"].S,
                IsInteracted = bool.Parse(n["IsInteracted"].BOOL.ToString())
            }).ToList();

            return new OkObjectResult(retVal);
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateNotification([FromBody] NotificationDTO notificationDTO)
        {
            var newNotification = new Notification()
            {
                Username = notificationDTO.Username,
                CreatedOn = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeMilliseconds(),
                NotificationID = Guid.NewGuid().ToString(),
                LocationID = notificationDTO.LocationID,
            };

            await _dbContext.SaveAsync<Notification>(newNotification);
            return new OkResult();
        }
    }
}

