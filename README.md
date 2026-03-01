# Expense Tracker Frontend

A modern, responsive React TypeScript application for tracking expenses and income with a clean dashboard showing financial statistics.

## Features

- **Dashboard**: View comprehensive financial statistics including total income, expenses, and balance
- **Expense Management**: Add, edit, and delete expenses with categories and descriptions
- **Income Management**: Add, edit, and delete income records with categories and descriptions
- **Real-time Statistics**: Get instant insights with min/max income and expenses
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
src/
├── api/
│   ├── expenseApi.ts      # Expense API service
│   └── incomeApi.ts       # Income API service
├── components/
│   ├── Dashboard.tsx      # Dashboard statistics component
│   ├── Dashboard.css
│   ├── ExpenseForm.tsx    # Add/Edit expense form
│   ├── ExpenseForm.css
│   ├── ExpenseList.tsx    # Display expenses
│   ├── ExpenseList.css
│   ├── IncomeForm.tsx     # Add/Edit income form
│   ├── IncomeForm.css
│   ├── IncomeList.tsx     # Display income records
│   ├── IncomeList.css
│   ├── Navigation.tsx     # Navigation bar
│   └── Navigation.css
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx               # Main application component
├── App.css
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running at `http://localhost:8080`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Configuration

The application is configured to connect to a backend API at `http://localhost:8080`. Make sure your backend server is running before starting the application.

If you need to change the API base URL, edit the `API_BASE_URL` constant in:
- `src/api/expenseApi.ts`
- `src/api/incomeApi.ts`

## API Endpoints

The application uses the following endpoints:

### Expenses
- `POST /api/expense` - Create a new expense
- `GET /api/expense/all` - Get all expenses
- `GET /api/expense/:id` - Get a specific expense
- `PUT /api/expense/:id` - Update an expense
- `DELETE /api/expense/:id` - Delete an expense

### Income
- `POST /api/income` - Create a new income record
- `GET /api/income/all` - Get all income records
- `GET /api/income/:id` - Get a specific income record
- `PUT /api/income/:id` - Update an income record
- `DELETE /api/income/:id` - Delete an income record

### Statistics
- `GET /api/stats` - Get financial statistics

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Styling

## Development

The application uses Vite for fast development and HMR (Hot Module Replacement). All components are organized in a modular structure for easy maintenance and scaling.

### Type Safety

All API responses and form data are typed using TypeScript interfaces defined in `src/types/index.ts`. This ensures type safety throughout the application.

## Error Handling

The application includes error handling for API calls with user-friendly error messages displayed in an error banner at the top of the page.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Open source - feel free to use and modify as needed.
