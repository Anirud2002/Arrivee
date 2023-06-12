using System;
using System.Text.Json;
using Amazon;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
namespace api
{
    public class Secrets
    {
        public Secrets()
        {
        }

        public async Task<SecretsObject> GetSecret()
        {
            string secretName = "ArriveeSecrets";

            IAmazonSecretsManager client = new AmazonSecretsManagerClient();

            GetSecretValueRequest request = new GetSecretValueRequest
            {
                SecretId = secretName,
            };

            GetSecretValueResponse response;

            try
            {
                response = await client.GetSecretValueAsync(request);
            }
            catch (Exception e)
            {
                throw e;
            }

            var secretObj = JsonSerializer.Deserialize<SecretsObject>(response.SecretString);

            return secretObj;
        }

        public class SecretsObject
        {
            public string GoogleApiKey { get; set; } = string.Empty;
            public string DBAccessKey { get; set; } = string.Empty;
            public string DBSecretAccessKey { get; set; } = string.Empty;
            public string SmtpPassword { get; set; } = string.Empty;
            public string SmtpHost { get; set; } = string.Empty;
        }
    }

}