using System;
namespace api.Interfaces
{
	public interface IEmailService
	{
		public Task SendEmailAsync(string senderFirstName, string senderLastName, string senderFeedback);

    }
}

