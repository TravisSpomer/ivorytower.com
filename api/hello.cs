using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

public static class Hello
{
	[FunctionName("hello")]
	public static IActionResult Run(
		[HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "v1/hello")] HttpRequest req)
	{
		throw new NotImplementedException("This version of the API is not yet implemented.");
		// return new OkObjectResult("{\"version\":0}");
	}
}
