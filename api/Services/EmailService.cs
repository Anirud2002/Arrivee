using System;
using api.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmail(string senderEmailAddress, string senderFirstName, string senderLastName, string senderFeedback)
        {
            var apiKey = _config.GetValue<string>("SendGrid:apiKey");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(senderEmailAddress, senderFirstName + " " + senderLastName);
            var subject = "LocationReminder Feedback!";
            var to = new EmailAddress("eduanirud@gmail.com", "Anirud Shrestha");
            var plainTextContent = senderFeedback;
            var htmlContent = "<strong>" + senderFeedback + "</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg).ConfigureAwait(false);

        }
    }
}

