using System;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

public static class LiveProxyFunctions
{
	[FunctionName("Live")]
	public static async System.Threading.Tasks.Task<IActionResult> Live(
		[HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", "delete", Route = "live/{*rest}")] HttpRequest request)
	{
		string pathString = request.Path.Value;
		if (!pathString.StartsWith("/api/live/", StringComparison.Ordinal))
			return new NotFoundResult();

		//pathString = $"/api/live/{pathString.Substring("/api/live/".Length)}";
		UriBuilder builder = new(scheme: "https", host: "api.ivorytower.com", port: 443, pathString);

		// HttpClientHandler handler = new()
		// {
		// 	ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator,
		// };
		using HttpClient client = new()
		{
			DefaultRequestVersion = new Version(2, 0),
		};
		HttpRequestMessage message = new(MethodFromString(request.Method), builder.ToString());
		System.IO.MemoryStream streamCopy = new();
		await request.Body.CopyToAsync(streamCopy);
		streamCopy.Seek(0, System.IO.SeekOrigin.Begin);
		message.Content = new StreamContent(streamCopy);
		// foreach (var header in request.Headers)
		// {
		// 	if (header.Key != "Host" && header.Key != "Accept-Encoding")
		// 		message.Headers.Add(header.Key, header.Value.ToArray());
		// }
		HttpResponseMessage response = await client.SendAsync(message);

		return new ObjectResult(await response.Content.ReadAsStringAsync())
		{
			StatusCode = ((int)response.StatusCode),
		};
	}

	private static HttpMethod MethodFromString(string methodName)
	{
		return methodName.ToUpperInvariant() switch
		{
			"GET" => HttpMethod.Get,
			"POST" => HttpMethod.Post,
			"DELETE" => HttpMethod.Delete,
			"PATCH" => HttpMethod.Patch,
			"PUT" => HttpMethod.Put,
			_ => throw new ArgumentOutOfRangeException(nameof(methodName)),
		};
	}
}
