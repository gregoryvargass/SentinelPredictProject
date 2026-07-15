import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

export default function BarChartCard({
  title,
  data,
  dataKey,
  xKey,
  onBarClick,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Visualización</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="h-72 rounded-xl border border-slate-800 bg-slate-950 p-3">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={xKey} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "16px",
                  color: "#f8fafc",
                }}
                labelStyle={{
                  color: "#f8fafc",
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: "#e2e8f0",
                }}
                // eslint-disable-next-line no-unused-vars
                formatter={(value, name) => [value, "Cantidad"]}
              />
              <Bar
                dataKey={dataKey}
                radius={[8, 8, 0, 0]}
                onClick={(entry) => {
                  if (onBarClick) {
                    onBarClick(entry);
                  }
                }}
                style={{ cursor: onBarClick ? "pointer" : "default" }}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#e2e8f0" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">No hay datos disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}