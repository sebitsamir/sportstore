import { SIZE_GUIDES } from '@/data/reviews';

export const metadata = { title: 'Size guide' };

export default function SizeGuidePage() {
  const guides = ['footwear', 'jerseys', 'balls'] as const;

  return (
    <div className="container-site py-14">
      <h1 className="font-display text-5xl">Size guide</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Measure once, order with confidence. When between sizes, size up for football boots; stay true-to-size for basketball.
      </p>
      <div className="mt-10 space-y-12">
        {guides.map((key) => {
          const g = SIZE_GUIDES[key];
          return (
            <section key={key}>
              <h2 className="font-display text-3xl">{g.title}</h2>
              <p className="mt-1 text-sm text-muted">{g.note}</p>
              <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-paper-elevated">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line bg-mist/50">
                      {g.headers.map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((row, i) => (
                      <tr key={i} className="border-b border-line/70">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2.5">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
