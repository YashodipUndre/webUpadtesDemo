import React from 'react';
import { Request } from '@/lib/data';

interface RequestTimelineProps {
    request: Request;
}

export function RequestTimeline({ request }: RequestTimelineProps) {
    const milestones = React.useMemo(() => {
        const events: { label: string; date: string; isComplete: boolean }[] = [];

        // Always start with Created
        events.push({
            label: 'Created',
            date: request.created_at,
            isComplete: true
        });

        // Use audit logs for history if available
        if (request.audit_logs && request.audit_logs.length > 0) {
            const statusCalls = request.audit_logs
                .filter(l => l.action.toLowerCase().includes('status'))
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

            statusCalls.forEach(l => {
                const label = l.new_value || l.action.replace('Updated Status to ', '');
                // Avoid redundant consecutive labels
                if (events[events.length - 1].label !== label) {
                    events.push({
                        label: label,
                        date: l.created_at,
                        isComplete: true
                    });
                }
            });
        }

        return events;
    }, [request]);

    // Simplified view: Just showing the last 3-4 distinct states to avoid overcrowding
    const displayEvents = milestones.slice(-4);

    return (
        <div className="flex items-center w-full max-w-xl mx-auto px-4 h-full">
            {displayEvents.map((event, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === displayEvents.length - 1;

                return (
                    <React.Fragment key={idx}>
                        {/* Connecting Line */}
                        {!isFirst && (
                            <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${event.isComplete ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
                        )}

                        {/* Node */}
                        <div className="relative flex flex-col items-center group">
                            <div className={`w-3 h-3 rounded-full border-2 z-10 transition-all ${isLast
                                ? 'bg-yellow-400 border-yellow-400 ring-4 ring-yellow-400/20 shadow-md'
                                : 'bg-white border-yellow-400'
                                }`}></div>

                            {/* Label */}
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                                <span className={`text-[9px] font-black uppercase tracking-wider block ${isLast ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {event.label}
                                </span>
                                <span className="text-[9px] text-slate-300 font-medium hidden group-hover:block transition-all bg-white px-1 relative z-20 shadow-sm border border-slate-100 rounded mt-1">
                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
