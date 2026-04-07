# RaiseNet-F

A blockchain-based crowdfunding platform for discovering, funding, and managing innovative projects.

## Features

- Browse and fund blockchain projects with MetaMask integration
- Admin and customer dashboards
- Project creation and management
- Real-time funding progress
- Modern UI with Tailwind CSS

## Getting Started

1. **Install dependencies:**

2. **Set up the database:**
- Ensure PostgreSQL is running.
- Run the SQL scripts in order:
  - `admin_seed.sql`
  - `create_users_table.sql`
  - `create_projects_table.sql`
  - `update_users_table.sql`

3. **Start the server:**

4. **Open the app:**
- Visit [http://localhost:3000](http://localhost:3000) in your browser.

## MetaMask Integration

- To fund a project, connect your MetaMask wallet and approve the transaction.
- Make sure you have enough ETH (or testnet tokens) for the transaction and gas fees.

## Folder Structure


## Customization

- Add your own project images in `public/images/projects/`.
- Update project data in `routes/api.js` for demo purposes.

## License

This project is for educational/demo purposes.
