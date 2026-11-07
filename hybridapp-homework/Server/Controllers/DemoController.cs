using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HybridApp.Server.Controllers;

[ApiController]
[Route("api/demo")]
[Authorize]
public sealed class DemoController : ControllerBase
{
    [HttpGet("message")]
    public IActionResult GetMessage()
    {
        return Ok(new
        {
            message = $"Привет, {User.Identity?.Name}! Запрос успешно обработан ASP.NET Core API.",
            serverTimeUtc = DateTimeOffset.UtcNow
        });
    }
}
