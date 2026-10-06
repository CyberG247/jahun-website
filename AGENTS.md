<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Portal architecture
- Preserve TanStack Start file-based routing and Tailwind v4 CSS tokens; this workspace does not support Next.js.
- Keep public civic pages at distinct top-level routes and shared navigation in the root layout so every page is shareable.
- Store all service submissions in the unified service_applications table with validated per-service details; this keeps common tracking and access rules consistent.
- Authenticate submission and private-document RPCs with requireSupabaseAuth and user-scoped clients; do not bypass RLS for ordinary civic workflows.
- Keep citizen roles separate in user_roles and reserve council approvals and certificate issuance for server-authorized officers.
- Use private civic-documents storage with user-prefix access and expiring URLs to protect citizen credentials.
- Use user-scoped officer RPCs and role-constrained RLS for council review and QR certificate issuance; certificates never expose citizen identity or banking data publicly.
