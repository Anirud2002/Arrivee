using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using SendGrid;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
namespace api.Controllers
{
    [Route("api/[controller]")]
    public class GoogleProxyController : Controller
    {
        private readonly IConfiguration _config;
        private string GoogleApiKey;
        public GoogleProxyController(IConfiguration config)
        {
            _config = config;
            GoogleApiKey = _config.GetValue<string>("Google:apiKey") ?? "";
        }

        [HttpGet("search-place/{place}")]
        public async Task<ActionResult> SearchPlace(string place)
        {
            // initially get the place id
            string? placeId = "";
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(
                    $"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={place}&inputtype=textquery&key={GoogleApiKey}"
                );
            if (response.IsSuccessStatusCode)
            {
                PlaceIdResponse? placeResponse = JsonConvert.DeserializeObject<PlaceIdResponse>(await response.Content.ReadAsStringAsync());
                placeId = placeResponse?.Candidates[0].Place_Id;
            }

            // api call to get the places

            HttpResponseMessage placesResponse = await client.GetAsync(
                    $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={GoogleApiKey}"
                );

            var jsonResult = await placesResponse.Content.ReadAsStringAsync();
            return new OkObjectResult(jsonResult);
        }
    }

    //public class PlaceDetails
    //{
    //    public string FormattedAddress { get; set; }
    //    public string Name { get; set; }
    //    public Cords Geometry { get; set; }
    //    public class Cords
    //    {
    //        public Location Location { get; set; }
    //    }
    //    public class Location
    //    {
    //        public double Lat { get; set; }
    //        public double Lng { get; set; }
    //    }
    //}





    public class PlaceIdResponse
    {
        public Candidate[] Candidates { get; set; }
        public string Status { get; set; }

        public class Candidate
        {
            public string Place_Id { get; set; }
        }
    }



}

