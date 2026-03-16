import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Report {
  id: string;
  title: string;
  date: string;
  source: string;
  keyFindings: string[];
  synthesis: string;
  pdfPath?: string | null;
}

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = new Date(report.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-2 bg-brand-light rounded-lg">
            <FileText className="w-4 h-4 text-brand-blue" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue bg-brand-light px-2 py-0.5 rounded">
                {report.source}
              </span>
              <span className="text-xs text-brand-muted">{formattedDate}</span>
            </div>
            <h3 className="font-semibold text-brand-dark text-base">
              {report.title}
            </h3>
          </div>
        </div>

        {report.pdfPath && (
          <a
            href={report.pdfPath}
            download
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-brand-blue hover:text-brand-dark transition-colors bg-brand-light hover:bg-brand-light/70 px-3 py-1.5 rounded-lg"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </a>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
          Key Findings
        </p>
        <ul className="space-y-1.5">
          {report.keyFindings.map((finding, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-brand-dark">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
              {finding}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-brand-dark transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" /> Hide full synthesis
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" /> Read full synthesis
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-surface-border">
          <p className="text-sm text-brand-dark leading-relaxed whitespace-pre-line">
            {report.synthesis}
          </p>
        </div>
      )}
    </div>
  );
}
