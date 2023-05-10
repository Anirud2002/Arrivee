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
            ArgumentNullException.ThrowIfNull(userName);

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
            ArgumentNullException.ThrowIfNull(userName);
            ArgumentNullException.ThrowIfNull(locationID);

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

        [HttpPost("create")]
        public async Task<ActionResult> CreateLocation([FromBody] LocationRequestDTO locationRequestDTO)
        {
            ArgumentNullException.ThrowIfNull(locationRequestDTO.Title);
            ArgumentNullException.ThrowIfNull(locationRequestDTO.StreetAddress);
            ArgumentNullException.ThrowIfNull(locationRequestDTO.Username);
            ArgumentNullException.ThrowIfNull(locationRequestDTO.RadiusUnit);
            if (locationRequestDTO.Radius == 0 || locationRequestDTO.Coords.Latitude == 0 || locationRequestDTO.Coords.Longitude == 0)
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
                Coords = new Coordinates()
                {
                    Latitude = locationRequestDTO.Coords.Latitude,
                    Longitude = locationRequestDTO.Coords.Longitude
                },
                RadiusUnit = locationRequestDTO.RadiusUnit,
                Reminders = locationRequestDTO.Reminders ?? new List<Reminder>(),
                NotificationTimestamp = 0
            };

            // get the user and update their locationIDs list
            var user = await _dbContext.LoadAsync<AppUser>(locationRequestDTO.Username);
            user.LocationReminderIDs.Add(newLocation.LocationID);

            await _dbContext.SaveAsync<AppUser>(user); // save updated user in table
            await _dbContext.SaveAsync<Location>(newLocation);
            return new OkObjectResult(newLocation.toViewModel());
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateLocation([FromBody] UpdateLocationRequestDTO updateLocationRequestDTO)
        {
            ArgumentNullException.ThrowIfNull(updateLocationRequestDTO.LocationID);
            ArgumentNullException.ThrowIfNull(updateLocationRequestDTO.Title);
            ArgumentNullException.ThrowIfNull(updateLocationRequestDTO.StreetAddress);
            ArgumentNullException.ThrowIfNull(updateLocationRequestDTO.Username);
            ArgumentNullException.ThrowIfNull(updateLocationRequestDTO.RadiusUnit);
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

        [HttpPut("update-timestamp")]
        public async Task<ActionResult> UpdateTimestamp([FromBody] UpdateTimestampDTO updateTimestampDTO)
        {
            ArgumentNullException.ThrowIfNull(updateTimestampDTO.Username);
            ArgumentNullException.ThrowIfNull(updateTimestampDTO.LocationID);

            if (!User.Exists(updateTimestampDTO.Username))
            {
                return new BadRequestObjectResult(new
                {
                    authenticated = false
                }); ;
            }

            var location = await _dbContext.LoadAsync<Location>(updateTimestampDTO.LocationID);
            location.NotificationTimestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            await _dbContext.SaveAsync<Location>(location);

            return new OkObjectResult(location.NotificationTimestamp);
        }

        [HttpDelete("delete/{userName}/{locationID}")]
        public async Task<ActionResult> DeleteLocation(string userName, string locationID)
        {
            ArgumentNullException.ThrowIfNull(userName);
            ArgumentNullException.ThrowIfNull(locationID);

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

            return new OkObjectResult(new
            {
                operationSuccess = true
            });
        }
    }
}

