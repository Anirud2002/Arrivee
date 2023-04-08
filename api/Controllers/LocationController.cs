using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using api.DTOs;
using api.Entities;
using api.Extensions;
using Microsoft.AspNetCore.Mvc;
using static api.Entities.Location;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    public class LocationController : Controller
    {
        private readonly IDynamoDBContext _dbContext;
        public LocationController(IDynamoDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("create-location")]
        public async Task<ActionResult> CreateLocation([FromBody] LocationRequestDTO locationRequestDTO)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(locationRequestDTO.Title);
            ArgumentNullException.ThrowIfNullOrEmpty(locationRequestDTO.StreetAddress);
            ArgumentNullException.ThrowIfNullOrEmpty(locationRequestDTO.UserName);
            ArgumentNullException.ThrowIfNullOrEmpty(locationRequestDTO.RadiusUnit);
            if(locationRequestDTO.Radius == 0)
            {
                throw new ArgumentNullException();
            };

            if (!User.Exists(locationRequestDTO.UserName)) {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            var newLocation = new Location()
            {
                LocationID = Guid.NewGuid().ToString(),
                UserName = locationRequestDTO.UserName,
                Title = locationRequestDTO.Title,
                StreetAddress = locationRequestDTO.StreetAddress,
                Radius = locationRequestDTO.Radius,
                RadiusUnit = locationRequestDTO.RadiusUnit,
                Reminders = locationRequestDTO.Reminders ?? new List<Reminder>(),
            };

            await _dbContext.SaveAsync<Location>(newLocation);
            return new OkObjectResult(new LocationResponseDTO()
            {
                LocationID = newLocation.LocationID,
                UserName = newLocation.UserName,
                Title = newLocation.Title,
                StreetAddress = newLocation.StreetAddress,
                Radius = newLocation.Radius,
                RadiusUnit = newLocation.RadiusUnit,
                Reminders = newLocation.Reminders
            });
        }
    }
}

