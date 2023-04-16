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

        [HttpGet("get-all-location/{userName}")]
        public async Task<ActionResult> GetLocation(string userName)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(userName);

            if (!User.Exists(userName))
            {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            var retVal = new List<LocationResponseDTO>();

            var user = await _dbContext.LoadAsync<AppUser>(userName);

            if (user.LocationReminderIDs.Count > 0)
            {
                foreach (string id in user.LocationReminderIDs)
                {
                    var location = await _dbContext.LoadAsync<Location>(id);
                    retVal.Add(location.toViewModel());
                }
            }

            return new OkObjectResult(retVal);
        }

        [HttpGet("get-location/{userName}/{locationID}")]
        public async Task<ActionResult> GetLocation(string userName, string locationID)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(userName);
            ArgumentNullException.ThrowIfNullOrEmpty(locationID);

            if (!User.Exists(userName))
            {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            var location = await _dbContext.LoadAsync<Location>(locationID);

            return new OkObjectResult(location.toViewModel());
        }

        [HttpPost("create-location")]
        public async Task<ActionResult> CreateLocation([FromBody] LocationRequestDTO locationRequestDTO)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(locationRequestDTO.Title);
            ArgumentNullException.ThrowIfNullOrEmpty(locationRequestDTO.StreetAddress);
            ArgumentNullException.ThrowIfNullOrEmpty(locationRequestDTO.Username);
            ArgumentNullException.ThrowIfNullOrEmpty(locationRequestDTO.RadiusUnit);
            if (locationRequestDTO.Radius == 0)
            {
                throw new ArgumentNullException();
            };

            if (!User.Exists(locationRequestDTO.Username))
            {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            var newLocation = new Location()
            {
                LocationID = Guid.NewGuid().ToString(),
                Username = locationRequestDTO.Username,
                Title = locationRequestDTO.Title,
                StreetAddress = locationRequestDTO.StreetAddress,
                Radius = locationRequestDTO.Radius,
                RadiusUnit = locationRequestDTO.RadiusUnit,
                Reminders = locationRequestDTO.Reminders ?? new List<Reminder>(),
            };

            // get the user and update their locationIDs list
            var user = await _dbContext.LoadAsync<AppUser>(locationRequestDTO.Username);
            user.LocationReminderIDs.Add(newLocation.LocationID);

            await _dbContext.SaveAsync<AppUser>(user); // save updated user in table
            await _dbContext.SaveAsync<Location>(newLocation);
            return new OkObjectResult(newLocation.toViewModel());
        }

        [HttpPut("update-location")]
        public async Task<ActionResult> UpdateLocation([FromBody] UpdateLocationRequestDTO updateLocationRequestDTO)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(updateLocationRequestDTO.LocationID);
            ArgumentNullException.ThrowIfNullOrEmpty(updateLocationRequestDTO.Title);
            ArgumentNullException.ThrowIfNullOrEmpty(updateLocationRequestDTO.StreetAddress);
            ArgumentNullException.ThrowIfNullOrEmpty(updateLocationRequestDTO.Username);
            ArgumentNullException.ThrowIfNullOrEmpty(updateLocationRequestDTO.RadiusUnit);
            if (updateLocationRequestDTO.Radius == 0)
            {
                throw new ArgumentNullException("Radius not defined!");
            };

            if (!User.Exists(updateLocationRequestDTO.Username))
            {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            var location = await _dbContext.LoadAsync<Location>(updateLocationRequestDTO.LocationID);
            location.Radius = updateLocationRequestDTO.Radius;
            location.RadiusUnit = updateLocationRequestDTO.RadiusUnit;
            location.Reminders = updateLocationRequestDTO.Reminders;

            await _dbContext.SaveAsync<Location>(location);
            return new OkObjectResult(location.toViewModel());
        }

        [HttpDelete("delete-location/{userName}/{locationID}")]
        public async Task<ActionResult> DeleteLocation(string userName, string locationID)
        {
            ArgumentNullException.ThrowIfNullOrEmpty(userName);
            ArgumentNullException.ThrowIfNullOrEmpty(locationID);

            if (!User.Exists(userName))
            {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            var location = await _dbContext.LoadAsync<Location>(locationID);
            var user = await _dbContext.LoadAsync<AppUser>(userName);

            user.LocationReminderIDs.Remove(locationID);

            if (user.LocationReminderIDs.Count == 0) // Not the best solution, need to find another way in future
            {
                user.LocationReminderIDs = null;
            }

            await _dbContext.SaveAsync<AppUser>(user);
            await _dbContext.DeleteAsync<Location>(location);

            return new OkResult();
        }
    }
}

