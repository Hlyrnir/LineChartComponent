using Microsoft.JSInterop;

namespace LineChartComponent
{
    public static class JsRuntimeExtension
    {
        public static async ValueTask<bool> InitializeLineChartAsync(this IJSRuntime jsRuntime, string sId, object oData, object oOption, CancellationToken tknCancellation)
        {
            await jsRuntime.InvokeVoidAsync("window.lineChart.initialize", tknCancellation, sId, "line", oData, oOption, null);

            return true;
        }

        public static async ValueTask<bool> UpdateLineChartAsync(this IJSRuntime jsRuntime, string sId, object oData, object oOption, CancellationToken tknCancellation)
        {
            await jsRuntime.InvokeVoidAsync("window.lineChart.update", tknCancellation, sId, "line", oData, oOption);

            return true;
        }
    }
}
