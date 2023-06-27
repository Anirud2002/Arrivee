using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using SendGrid;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
namespace api.Controllers
{
    [Route("api/[controller]")]
    public class GoogleProxyController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _environment;
        private string GoogleApiKey;
        public GoogleProxyController(IConfiguration config, IWebHostEnvironment environment)
        {
            _config = config;
            _environment = environment;
        }

        [Authorize]
        [HttpGet("search-place/{place}")]
        public async Task<ActionResult> SearchPlace(string place)
        {
            await GetGoogleApiKey();

            // request to get all the places
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(
                    $"https://maps.googleapis.com/maps/api/place/textsearch/json?query={place}&key={GoogleApiKey}"
                );

            var jsonResult = await response.Content.ReadAsStringAsync();
            return new OkObjectResult(jsonResult);
        }

        public async Task GetGoogleApiKey()
        {
            if(_environment.IsDevelopment())
            {
                GoogleApiKey = _config.GetValue<string>("Google:apiKey");
            } else
            {
                var secrets = await (new Secrets().GetSecret());
                GoogleApiKey = secrets.GoogleApiKey;
            }
        }
    }

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

