# Supersharkz Charge Management

A single-page charge recording system for Supersharkz Swim School. Built with Next.js, Tailwind CSS, and TypeScript.

## Live Demo

https://supersharkz-charge-management-azri.vercel.app/

## How to Run

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser.

No environment variables or backend setup required — all data is managed in client-side state using mock records.

---

## Assumptions, Trade-offs & What's Next

**Assumptions made:**
Assumed a single admin role is viewing all data, so authentication and pagination are out of scope for this mock. All financial figures are assumed to be in Ringgit Malaysia (RM) and are formatted to two decimal places for clarity. Assumed charge IDs follow a sequential `chg_000` format derived from the highest existing ID in the list.

**Trade-offs chosen:**
I opted for standard React state (`useState`/`useEffect`) instead of Redux or Zustand. For a single CRUD page, installing a heavy state management tool increases boilerplate and reduces readability without adding actual value. The status filter (Paid, Unpaid, Partial) operates on the client side since the dataset is small. If the system has a very large amount of data (thousands of records), the filtering/searching should be done on the backend instead of the frontend.

**What I would improve next:**
As the swim school grows, I would implement a search bar to easily locate specific `student_id`s, along with server-side pagination to handle larger datasets. I would also add a date picker to filter charges by options such as "This Month" or "Last 30 Days" so administrators can easily review records at the end of the month. Additionally, I would also add summary cards above the table to display key information such as the total charged, collected, and outstanding amounts, so administrators can quickly understand the financial status. Finally, I would support exporting the ledger as a CSV file, making it easier for accounting and reporting purposes.

---

## UX Reflection

Three realistic mistakes a non-technical admin might make, and how the UI prevents them:

1. **Entering a paid amount larger than the charge amount** — An admin might record RM 200 paid on a RM 150 charge by mistake. The paid amount field validates in **real time** as the user types, if the value exceeds the charge amount, an error appears immediately before they can even submit the form.

2. **Submitting a charge with missing or invalid data** — Leaving the Student ID blank, entering a negative amount or not filling in a date. Every field has required validation with descriptive error messages. Number inputs use `min` constraints and `step="0.01"` to guide correct entry. The form won't submit until all validations pass.

3. **Saving an edit when nothing was changed** — An admin might open a record, realise they opened the wrong one, and hit Save out of habit. The Save Changes button is disabled until at least one field differs from the original values, making it impossible to submit changes when nothing was modified.

---

## Deletion Handling

Deletion is a two-step interaction: clicking the Delete button does not remove the record immediately, it opens a confirmation modal showing the charge's details (Charge ID, Student ID, Amount, Date) along with a warning that the action is irreversible. The modal has two buttons with clear visual differences (Red "Yes, delete permanently" vs Gray "Cancel, keep the charge"). This design helps prevent mistakes while still keeping the process fast. The admin must explicitly click "Yes, delete permanently" to confirm the deletion. After clicking it, a short confirmation animation (600ms) appears where the button shows a spinner and the text "Deleting...", and it becomes unclickable to prevent multiple submissions.

This approach was chosen because charge records represent real financial transactions. If a record is deleted by mistake, it cannot be recovered in the current client-only system. Therefore, a confirmation step is important to prevent accidental deletion. Showing the charge details in the modal gives the admin one last chance to check that they are deleting the correct record.