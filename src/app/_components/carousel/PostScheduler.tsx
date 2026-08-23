import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Check, Clock, Loader2 } from 'lucide-react';
import React, { useCallback,useState } from 'react';

import { Button } from '@/app/_components/ui/button';
import { Calendar } from '@/app/_components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/_components/ui/dialog';
import { cn } from '@/lib/utils';

interface ScheduleData {
  date: Date;
  time: string;
}

interface PostSchedulerProps {
  projectName?: string;
  onSchedule: (data: ScheduleData) => void;
}

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

export default function PostScheduler({ projectName, onSchedule }: PostSchedulerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = useCallback(() => {
    if (!selectedDate || !selectedTime) return;
    setScheduling(true);

    setTimeout(() => {
      onSchedule({ date: selectedDate, time: selectedTime });
      setScheduling(false);
      setScheduled(true);
      setTimeout(() => {
        setScheduled(false);
        setOpen(false);
        setSelectedDate(undefined);
        setSelectedTime('');
      }, 2000);
    }, 1000);
  }, [selectedDate, selectedTime, onSchedule]);

  const isReady = selectedDate && selectedTime;

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-4 py-5 rounded-lg" variant="outline">
          <CalendarDays className="w-4 h-4 text-primary" />
          Agendar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[85vw] max-h-[80vh] bg-background overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-barlow text-editor-text flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Agendar Publicação
          </DialogTitle>
        </DialogHeader>

        {projectName && (
          <p className="text-sm">
            Agendando: <span className="font-barlow">{projectName}</span>
          </p>
        )}

        {/* Scheduled success */}
        {scheduled ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-green-500" />
            </div>
            <p className="font-barlow font-semibold text-sm text-editor-text">
              Publicação agendada!
            </p>
            <p className="font-barlow text-xs text-editor-text-muted mt-1">
              {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTime}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Calendar */}
            <div>
              <label className="block text-sm font-barlow text-editor-text-muted mb-2">
                Selecione a data
              </label>
              <div className="flex justify-center rounded-lg bg-editor-surface border border-editor-border p-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={date => date < new Date()}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-barlow font-medium text-editor-text",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-editor-border text-editor-text-muted hover:bg-editor-border transition-colors",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-editor-text-muted rounded-md w-9 font-normal text-[0.8rem] font-barlow",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative font-barlow",
                    day: "h-9 w-9 p-0 font-normal text-editor-text hover:bg-editor-border rounded-md transition-colors inline-flex items-center justify-center",
                    day_range_end: "day-range-end",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-editor-text-muted opacity-30",
                    day_disabled: "text-editor-text-muted opacity-20",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </div>

            {/* Time selection */}
            <div>
              <label className="text-xs font-barlow text-editor-text-muted mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Selecione o horário
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {timeSlots.map(time => (
                  <Button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "px-2 py-2 rounded-md text-xs font-barlow font-medium transition-colors",
                      selectedTime === time
                        ? "bg-primary text-primary-foreground"
                        : "bg-editor-surface border border-editor-border text-editor-text-muted hover:text-editor-text hover:border-primary/40"
                    )}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {isReady && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="font-barlow text-xs text-editor-text-muted">
                  Publicação programada para:
                </p>
                <p className="font-barlow font-semibold text-sm text-editor-text mt-0.5">
                  {format(selectedDate!, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTime}
                </p>
              </div>
            )}

            {/* Schedule button */}
            <Button
              onClick={handleSchedule}
              disabled={!isReady || scheduling}
              className="w-full flex items-center justify-center gap-2 px-4 py-5 rounded-lg font-barlow font-semibold text-sm text-primary-foreground bg-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {scheduling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CalendarDays className="w-4 h-4" />
              )}
              {scheduling ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
