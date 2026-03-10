import { useState, useMemo } from 'react';
import { Expense, Income, Transfer } from '../types';
import './ActivityCalendar.css';

interface ActivityCalendarProps {
  expenses: Expense[];
  incomes: Income[];
  transfers?: Transfer[];
}

interface DayData {
  date: string;
  day: number;
  expenseAmount: number;
  incomeAmount: number;
  hasTransaction: boolean;
  transactions: number;
}

export const ActivityCalendar = ({ expenses, incomes, transfers = [] }: ActivityCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const monthData = useMemo(() => {
    const data: Record<string, DayData> = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Helper function to format date as YYYY-MM-DD in local time
    const formatLocalDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // Generate all days in the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = formatLocalDate(date);
      
      data[dateStr] = {
        date: dateStr,
        day: i,
        expenseAmount: 0,
        incomeAmount: 0,
        hasTransaction: false,
        transactions: 0,
      };
    }

    // Add expenses
    expenses.forEach((expense) => {
      const dateStr = expense.date.split('T')[0];
      if (data[dateStr]) {
        data[dateStr].expenseAmount += expense.amount;
        data[dateStr].hasTransaction = true;
        data[dateStr].transactions += 1;
      }
    });

    // Add income
    incomes.forEach((income) => {
      const dateStr = income.date.split('T')[0];
      if (data[dateStr]) {
        data[dateStr].incomeAmount += income.amount;
        data[dateStr].hasTransaction = true;
        data[dateStr].transactions += 1;
      }
    });

    // Add transfers
    transfers.forEach((transfer) => {
      const dateStr = transfer.date.split('T')[0];
      if (data[dateStr]) {
        data[dateStr].hasTransaction = true;
        data[dateStr].transactions += 1;
      }
    });

    return data;
  }, [expenses, incomes, transfers, currentDate]);

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const monthDate = currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  // Get first day of week for the first day of the month
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  // Create grid including empty cells for days before the month starts
  const calendarDays: (DayData | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  const sortedDays = Object.values(monthData).sort((a, b) => a.day - b.day);
  calendarDays.push(...sortedDays);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <div className="activity-calendar-monthly">
      <div className="calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth} title="Previous month">
          ←
        </button>
        <div className="month-display">
          <div className="month-day">{currentDate.getDate()}</div>
          <div className="month-name">{currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
        </div>
        <button className="nav-btn" onClick={handleNextMonth} title="Next month">
          →
        </button>
      </div>

      <div className="calendar-grid-monthly">
        {/* Week day headers */}
        <div className="week-headers-monthly">
          {weekDays.map((day) => (
            <div key={day} className="week-header-monthly">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="calendar-cells-monthly">
          {calendarDays.map((dayData, index) => {
            if (dayData === null) {
              return <div key={`empty-${index}`} className="calendar-cell-monthly empty"></div>;
            }

            const isFuture = dayData.date > todayDate;

            return (
              <div
                key={dayData.date}
                className={`calendar-cell-monthly ${
                  dayData.hasTransaction ? 'has-transaction-monthly' : 'no-transaction-monthly'
                } ${isFuture ? 'frozen-date' : ''}`}
                onMouseEnter={(e) => {
                  if (!isFuture) {
                    handleMouseEnter(e);
                    setHoveredDate(dayData.date);
                  }
                }}
                onMouseLeave={() => {
                  if (!isFuture) {
                    setHoveredDate(null);
                  }
                }}
                title={isFuture ? 'Future date - locked' : `${dayData.date}`}
                style={{ pointerEvents: isFuture ? 'none' : 'auto' }}
              >
                <div className="day-number">{dayData.day}</div>
                {!isFuture && (
                  <>
                    {dayData.hasTransaction ? (
                      <span className="transaction-icon-monthly">✓</span>
                    ) : (
                      <span className="no-activity-dot-monthly"></span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDate && monthData[hoveredDate] && (
        <div
          className="calendar-tooltip-monthly"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 40}px`,
          }}
        >
          <strong>{hoveredDate}</strong>
          {monthData[hoveredDate].incomeAmount > 0 && (
            <div className="tooltip-income">
              💰 Income: ₹{monthData[hoveredDate].incomeAmount.toFixed(2)}
            </div>
          )}
          {monthData[hoveredDate].expenseAmount > 0 && (
            <div className="tooltip-expense">
              💸 Expense: ₹{monthData[hoveredDate].expenseAmount.toFixed(2)}
            </div>
          )}
          {monthData[hoveredDate].transactions > (monthData[hoveredDate].incomeAmount > 0 ? 1 : 0) + (monthData[hoveredDate].expenseAmount > 0 ? 1 : 0) && (
            <div className="tooltip-transfer">
              🔄 Transfer
            </div>
          )}
        </div>
      )}
    </div>
  );
};

