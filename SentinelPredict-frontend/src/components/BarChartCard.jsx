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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      <div className="mt-4 h-72">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={xKey} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                }}
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
          <p className="text-sm text-slate-400">No hay datos disponibles.</p>
        )}
      </div>
    </div>
  );
}