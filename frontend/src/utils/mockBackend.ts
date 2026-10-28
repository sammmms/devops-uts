import type { CategoryModel } from "@/models/CategoryModel";
import type { TodoModel } from "@/models/TodoModel";
import { supabase } from "./supabaseClient";

interface StoredUser {
  id: string;
  email: string;
  username: string;
  password?: string;
  provider?: string;
}

const STORAGE_KEY_USERS = "devops_todo_users";
const STORAGE_KEY_CATEGORIES = "devops_todo_categories";
const STORAGE_KEY_TODOS = "devops_todo_todos";

function getLocalUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

function getLocalCategories(userId?: string): CategoryModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    const all = raw ? JSON.parse(raw) : [];
    if (!userId) return all;
    return all.filter((c: any) => !c.user_id || c.user_id === userId);
  } catch {
    return [];
  }
}

function saveLocalCategories(categories: any[]) {
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
}

function getLocalTodos(userId?: string): TodoModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TODOS);
    const all = raw ? JSON.parse(raw) : [];
    if (!userId) return all;
    return all.filter((t: any) => !t.user_id || t.user_id === userId);
  } catch {
    return [];
  }
}

function saveLocalTodos(todos: any[]) {
  localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
}

function getCurrentUserId(): string | undefined {
  try {
    const raw = localStorage.getItem("authUser");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.id;
  } catch {
    return undefined;
  }
}

export async function seedUserData(userId: string) {
  // Check if categories already exist in Supabase
  try {
    const { data: existing } = await supabase
      .from("devops_categories")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    if (existing && existing.length > 0) return;
  } catch {
    // If Supabase check fails, check local
    if (getLocalCategories(userId).length > 0) return;
  }

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const pastDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const tomorrowDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
  const nextWeekDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const farDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  try {
    // Insert categories into Supabase
    const { data: cats, error: catErr } = await supabase
      .from("devops_categories")
      .insert([
        { user_id: userId, name: "DevOps & Cloud 🚀" },
        { user_id: userId, name: "Portfolio & Apps 💻" },
        { user_id: userId, name: "Personal & Learning 📚" },
      ])
      .select();

    if (!catErr && cats && cats.length >= 3) {
      await supabase.from("devops_todos").insert([
        {
          user_id: userId,
          category_id: cats[1].id,
          name: "Deploy Kasir to custom domain kasir.wsnsam.my.id",
          description: "Setup Vercel project, Supabase database, and Cloudflare DNS",
          completed: true,
          priority: "high",
          deadline: formatDate(now),
        },
        {
          user_id: userId,
          category_id: cats[0].id,
          name: "Add User Registration & OAuth login to DevOps Todo",
          description: "Support registration, Google/GitHub OAuth, and full task workflow",
          completed: true,
          priority: "urgent",
          deadline: formatDate(now),
        },
        {
          user_id: userId,
          category_id: cats[0].id,
          name: "Configure Cloudflare CNAME for todo.wsnsam.my.id",
          description: "Target CNAME: e4c6d4d67fbb3d87.vercel-dns-017.com",
          completed: false,
          priority: "high",
          deadline: formatDate(tomorrowDate),
        },
        {
          user_id: userId,
          category_id: cats[0].id,
          name: "Audit legacy CI/CD runner pipelines",
          description: "Check stale docker image cache and secrets rotation",
          completed: false,
          priority: "high",
          deadline: formatDate(pastDate),
        },
        {
          user_id: userId,
          category_id: cats[0].id,
          name: "Practice Kubernetes lab with Helm charts",
          description: "Deploy ingress-nginx and cert-manager on test cluster",
          completed: false,
          priority: "medium",
          deadline: formatDate(nextWeekDate),
        },
        {
          user_id: userId,
          category_id: cats[2].id,
          name: "Explore TanStack Start and Server Functions",
          description: "Study routing, SSR, and database pooling patterns",
          completed: false,
          priority: "low",
          deadline: formatDate(farDate),
        },
      ]);
      return;
    }
  } catch (err) {
    console.warn("Supabase seed failed, falling back to local storage:", err);
  }

  // Fallback to local storage if Supabase is unreachable
  const baseId = Date.now();
  const defaultCategories: any[] = [
    { id: baseId + 1, name: "DevOps & Cloud 🚀", user_id: userId },
    { id: baseId + 2, name: "Portfolio & Apps 💻", user_id: userId },
    { id: baseId + 3, name: "Personal & Learning 📚", user_id: userId },
  ];
  const defaultTodos: any[] = [
    {
      id: baseId + 101,
      name: "Deploy Kasir to custom domain kasir.wsnsam.my.id",
      description: "Setup Vercel project, Supabase database, and Cloudflare DNS",
      completed: true,
      priority: "high",
      deadline: formatDate(now),
      category_id: baseId + 2,
      user_id: userId,
    },
    {
      id: baseId + 102,
      name: "Add User Registration & OAuth login to DevOps Todo",
      description: "Support registration, Google/GitHub OAuth, and full task workflow",
      completed: true,
      priority: "urgent",
      deadline: formatDate(now),
      category_id: baseId + 1,
      user_id: userId,
    },
    {
      id: baseId + 103,
      name: "Configure Cloudflare CNAME for todo.wsnsam.my.id",
      description: "Target CNAME: e4c6d4d67fbb3d87.vercel-dns-017.com",
      completed: false,
      priority: "high",
      deadline: formatDate(tomorrowDate),
      category_id: baseId + 1,
      user_id: userId,
    },
  ];
  saveLocalCategories([...getLocalCategories(), ...defaultCategories]);
  saveLocalTodos([...getLocalTodos(), ...defaultTodos]);
}

export async function handleMockApi(
  method: string,
  url: string,
  data?: any,
  params?: any
): Promise<{ status: number; data: any }> {
  const normMethod = method.toUpperCase();
  const cleanUrl = url.replace(/^\/api\/v1/, "");
  const currentUserId = getCurrentUserId();

  // POST /auth/login
  if (cleanUrl === "/auth/login" && normMethod === "POST") {
    const identifier = (data?.email || data?.username || "").trim().toLowerCase();
    const password = data?.password;

    try {
      const { data: users } = await supabase
        .from("devops_users")
        .select("*")
        .or(`email.eq.${identifier},username.eq.${identifier}`)
        .limit(1);

      let user = users && users[0];

      if (!user) {
        const username = identifier.includes("@")
          ? identifier.split("@")[0]
          : identifier;
        const email = identifier.includes("@")
          ? identifier
          : `${identifier}@example.com`;

        const newId = `user-${Date.now()}`;
        const { data: created, error } = await supabase
          .from("devops_users")
          .insert({
            id: newId,
            email,
            username,
            password_hash: password,
          })
          .select()
          .single();

        user = !error && created ? created : { id: newId, email, username };
        await seedUserData(user.id);
      }

      return {
        status: 200,
        data: {
          message: "Login successful",
          data: {
            access_token: `token-${user.id}-${Date.now()}`,
            token_type: "bearer",
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
            },
          },
        },
      };
    } catch {
      // Local fallback
      const users = getLocalUsers();
      let user = users.find(
        (u) =>
          u.email.toLowerCase() === identifier ||
          u.username.toLowerCase() === identifier
      );
      if (!user) {
        user = {
          id: `user-${Date.now()}`,
          email: identifier.includes("@") ? identifier : `${identifier}@example.com`,
          username: identifier.includes("@") ? identifier.split("@")[0] : identifier,
          password,
        };
        users.push(user);
        saveLocalUsers(users);
        await seedUserData(user.id);
      }
      return {
        status: 200,
        data: {
          message: "Login successful",
          data: {
            access_token: `token-${user.id}`,
            token_type: "bearer",
            user: { id: user.id, email: user.email, username: user.username },
          },
        },
      };
    }
  }

  // POST /auth/register
  if (cleanUrl === "/auth/register" && normMethod === "POST") {
    const email = (data?.email || "").trim().toLowerCase();
    const username = (data?.username || "").trim();
    const password = data?.password;

    if (!email || !username || !password) {
      return {
        status: 400,
        data: { detail: "All fields are required." },
      };
    }

    try {
      const { data: existing } = await supabase
        .from("devops_users")
        .select("id")
        .or(`email.eq.${email},username.eq.${username}`)
        .limit(1);

      if (existing && existing.length > 0) {
        return {
          status: 400,
          data: { detail: "User with this email or username already exists." },
        };
      }

      const newId = `user-${Date.now()}`;
      const { data: newUser, error } = await supabase
        .from("devops_users")
        .insert({
          id: newId,
          email,
          username,
          password_hash: password,
        })
        .select()
        .single();

      const createdUser = !error && newUser ? newUser : { id: newId, email, username };
      await seedUserData(createdUser.id);

      return {
        status: 201,
        data: {
          message: "User registered successfully",
          data: {
            access_token: `token-${createdUser.id}-${Date.now()}`,
            token_type: "bearer",
            user: {
              id: createdUser.id,
              email: createdUser.email,
              username: createdUser.username,
            },
          },
        },
      };
    } catch {
      const newId = `user-${Date.now()}`;
      const newUser = { id: newId, email, username, password };
      const users = getLocalUsers();
      users.push(newUser);
      saveLocalUsers(users);
      await seedUserData(newId);
      return {
        status: 201,
        data: {
          message: "User registered successfully",
          data: {
            access_token: `token-${newId}`,
            token_type: "bearer",
            user: { id: newId, email, username },
          },
        },
      };
    }
  }

  // GET /category
  if (cleanUrl === "/category" && normMethod === "GET") {
    try {
      let query = supabase.from("devops_categories").select("*");
      if (currentUserId) query = query.eq("user_id", currentUserId);
      const { data: cats, error } = await query.order("id", { ascending: true });

      let todoQuery = supabase.from("devops_todos").select("id, category_id");
      if (currentUserId) todoQuery = todoQuery.eq("user_id", currentUserId);
      const { data: todos } = await todoQuery;

      if (!error && cats) {
        const categoriesWithCount = cats.map((cat) => ({
          ...cat,
          todos_count: todos ? todos.filter((t) => t.category_id === cat.id).length : 0,
        }));
        return { status: 200, data: { categories: categoriesWithCount } };
      }
    } catch (e) {
      console.warn("Supabase fetch categories failed:", e);
    }

    const cats = getLocalCategories(currentUserId);
    const todos = getLocalTodos(currentUserId);
    const categoriesWithCount = cats.map((cat) => ({
      ...cat,
      todos_count: todos.filter((t) => t.category_id === cat.id).length,
    }));
    return { status: 200, data: { categories: categoriesWithCount } };
  }

  // POST /category
  if (cleanUrl === "/category" && normMethod === "POST") {
    const name = data?.name?.trim();
    if (!name) {
      return { status: 400, data: { detail: "Category name is required" } };
    }

    try {
      const { data: created, error } = await supabase
        .from("devops_categories")
        .insert({
          user_id: currentUserId || "guest",
          name,
        })
        .select()
        .single();

      if (!error && created) {
        return {
          status: 201,
          data: {
            message: "Category created",
            category: { ...created, todos_count: 0 },
          },
        };
      }
    } catch (e) {
      console.warn("Supabase create category failed:", e);
    }

    const allCats = getLocalCategories();
    const newCat = {
      id: Date.now(),
      name,
      user_id: currentUserId,
      todos_count: 0,
    };
    allCats.push(newCat);
    saveLocalCategories(allCats);
    return {
      status: 201,
      data: { message: "Category created", category: newCat },
    };
  }

  // PUT /category/:id
  const catPutMatch = cleanUrl.match(/^\/category\/(\d+)$/);
  if (catPutMatch && normMethod === "PUT") {
    const catId = Number(catPutMatch[1]);
    try {
      const { data: updated, error } = await supabase
        .from("devops_categories")
        .update({ name: data?.name })
        .eq("id", catId)
        .select()
        .single();

      if (!error && updated) {
        return {
          status: 200,
          data: { message: "Category updated", category: updated },
        };
      }
    } catch {}

    const allCats = getLocalCategories();
    const catIndex = allCats.findIndex((c) => c.id === catId);
    if (catIndex >= 0) {
      allCats[catIndex] = {
        ...allCats[catIndex],
        name: data?.name || allCats[catIndex].name,
      };
      saveLocalCategories(allCats);
      return {
        status: 200,
        data: { message: "Category updated", category: allCats[catIndex] },
      };
    }
    return { status: 404, data: { detail: "Category not found" } };
  }

  // DELETE /category/:id
  const catDelMatch = cleanUrl.match(/^\/category\/(\d+)$/);
  if (catDelMatch && normMethod === "DELETE") {
    const catId = Number(catDelMatch[1]);
    try {
      await supabase.from("devops_categories").delete().eq("id", catId);
    } catch {}

    const allCats = getLocalCategories().filter((c) => c.id !== catId);
    saveLocalCategories(allCats);
    return { status: 200, data: { message: "Category deleted" } };
  }

  // GET /todo
  if (cleanUrl === "/todo" && normMethod === "GET") {
    const p = params || {};
    try {
      let query = supabase.from("devops_todos").select("*");
      if (currentUserId) query = query.eq("user_id", currentUserId);

      if (p.category_id !== undefined && p.category_id !== null) {
        query = query.eq("category_id", Number(p.category_id));
      }
      if (p.completed !== undefined) {
        query = query.eq("completed", String(p.completed) === "true");
      }
      if (p.priority) {
        query = query.eq("priority", p.priority);
      }
      if (p.search && typeof p.search === "string" && p.search.trim()) {
        query = query.ilike("name", `%${p.search.trim()}%`);
      }

      const { data: todos, error } = await query.order("id", { ascending: false });

      if (!error && todos) {
        let result = todos;
        if (p.overdue !== undefined) {
          const isOverdue = String(p.overdue) === "true";
          const todayStr = new Date().toISOString().split("T")[0];
          result = result.filter((t) => {
            if (!t.deadline || t.completed) return false;
            return isOverdue ? t.deadline < todayStr : t.deadline >= todayStr;
          });
        }
        return { status: 200, data: { todos: result } };
      }
    } catch (e) {
      console.warn("Supabase fetch todos failed:", e);
    }

    let todos = getLocalTodos(currentUserId);
    if (p.category_id !== undefined && p.category_id !== null) {
      todos = todos.filter((t) => t.category_id === Number(p.category_id));
    }
    if (p.completed !== undefined) {
      todos = todos.filter((t) => t.completed === (String(p.completed) === "true"));
    }
    if (p.priority) {
      todos = todos.filter((t) => t.priority === p.priority);
    }
    if (p.search && typeof p.search === "string" && p.search.trim()) {
      const q = p.search.toLowerCase();
      todos = todos.filter((t) => t.name.toLowerCase().includes(q));
    }
    return { status: 200, data: { todos } };
  }

  // POST /todo
  if (cleanUrl === "/todo" && normMethod === "POST") {
    try {
      const { data: created, error } = await supabase
        .from("devops_todos")
        .insert({
          user_id: currentUserId || "guest",
          name: data?.name || "Untitled Todo",
          description: data?.description || "",
          deadline: data?.deadline || null,
          completed: !!data?.completed,
          priority: data?.priority || "medium",
          category_id: data?.category_id ? Number(data.category_id) : null,
        })
        .select()
        .single();

      if (!error && created) {
        return {
          status: 201,
          data: { message: "Todo created successfully", todo: created },
        };
      }
    } catch (e) {
      console.warn("Supabase create todo failed:", e);
    }

    const allTodos = getLocalTodos();
    const newTodo: any = {
      id: Date.now(),
      name: data?.name || "Untitled Todo",
      description: data?.description || "",
      deadline: data?.deadline || "",
      completed: !!data?.completed,
      priority: data?.priority || "medium",
      category_id: data?.category_id ? Number(data.category_id) : undefined,
      user_id: currentUserId,
    };
    allTodos.unshift(newTodo);
    saveLocalTodos(allTodos);
    return {
      status: 201,
      data: { message: "Todo created successfully", todo: newTodo },
    };
  }

  // PUT /todo/:id
  const todoPutMatch = cleanUrl.match(/^\/todo\/(\d+)$/);
  if (todoPutMatch && normMethod === "PUT") {
    const todoId = Number(todoPutMatch[1]);
    try {
      const updateData: any = {};
      if (data?.name !== undefined) updateData.name = data.name;
      if (data?.description !== undefined) updateData.description = data.description;
      if (data?.deadline !== undefined) updateData.deadline = data.deadline;
      if (data?.completed !== undefined) updateData.completed = data.completed;
      if (data?.priority !== undefined) updateData.priority = data.priority;
      if (data?.category_id !== undefined) updateData.category_id = data.category_id;

      const { data: updated, error } = await supabase
        .from("devops_todos")
        .update(updateData)
        .eq("id", todoId)
        .select()
        .single();

      if (!error && updated) {
        return {
          status: 200,
          data: { message: "Todo updated successfully", todo: updated },
        };
      }
    } catch {}

    const allTodos = getLocalTodos();
    const idx = allTodos.findIndex((t) => t.id === todoId);
    if (idx >= 0) {
      allTodos[idx] = {
        ...allTodos[idx],
        ...data,
        id: todoId,
        user_id: allTodos[idx].user_id || currentUserId,
      };
      saveLocalTodos(allTodos);
      return {
        status: 200,
        data: { message: "Todo updated successfully", todo: allTodos[idx] },
      };
    }
    return { status: 404, data: { detail: "Todo not found" } };
  }

  // DELETE /todo/:id
  const todoDelMatch = cleanUrl.match(/^\/todo\/(\d+)$/);
  if (todoDelMatch && normMethod === "DELETE") {
    const todoId = Number(todoDelMatch[1]);
    try {
      await supabase.from("devops_todos").delete().eq("id", todoId);
    } catch {}

    const allTodos = getLocalTodos().filter((t) => t.id !== todoId);
    saveLocalTodos(allTodos);
    return { status: 200, data: { message: "Todo deleted successfully" } };
  }

  // GET /dashboard/stats
  if (cleanUrl === "/dashboard/stats" && normMethod === "GET") {
    let todos: any[] = [];
    let categories: any[] = [];

    try {
      let tQuery = supabase.from("devops_todos").select("*");
      if (currentUserId) tQuery = tQuery.eq("user_id", currentUserId);
      const { data: tData } = await tQuery;
      if (tData) todos = tData;

      let cQuery = supabase.from("devops_categories").select("*");
      if (currentUserId) cQuery = cQuery.eq("user_id", currentUserId);
      const { data: cData } = await cQuery;
      if (cData) categories = cData;
    } catch {}

    if (todos.length === 0 && categories.length === 0) {
      todos = getLocalTodos(currentUserId);
      categories = getLocalCategories(currentUserId);
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`;
    const nextWeekDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextWeekStr = `${nextWeekDate.getFullYear()}-${pad(
      nextWeekDate.getMonth() + 1
    )}-${pad(nextWeekDate.getDate())}`;

    const total_todos = todos.length;
    const completed_todos = todos.filter((t) => t.completed).length;
    const pending_todos = total_todos - completed_todos;
    const total_categories = categories.length;

    const overdue_todos = todos.filter(
      (t) => t.deadline && t.deadline < todayStr && !t.completed
    );

    const upcoming_todos = todos.filter(
      (t) =>
        t.deadline &&
        t.deadline >= todayStr &&
        t.deadline <= nextWeekStr &&
        !t.completed
    );

    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const catCounts: Record<string, number> = {};
    for (const t of todos) {
      const catName = t.category_id ? catMap.get(t.category_id) || "Other" : "Uncategorized";
      catCounts[catName] = (catCounts[catName] || 0) + 1;
    }

    const category_distribution = Object.entries(catCounts).map(
      ([name, value]) => ({ name, value })
    );

    const priorityCounts: Record<string, number> = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    for (const t of todos) {
      const p = t.priority || "medium";
      if (priorityCounts[p] !== undefined) {
        priorityCounts[p]++;
      }
    }

    const priorityColors: Record<string, string> = {
      urgent: "bg-red-500",
      high: "bg-orange-500",
      medium: "bg-blue-500",
      low: "bg-gray-500",
    };

    const priority_distribution = [
      { name: "urgent", value: priorityCounts.urgent, color: priorityColors.urgent },
      { name: "high", value: priorityCounts.high, color: priorityColors.high },
      { name: "medium", value: priorityCounts.medium, color: priorityColors.medium },
      { name: "low", value: priorityCounts.low, color: priorityColors.low },
    ];

    return {
      status: 200,
      data: {
        status: "success",
        data: {
          total_todos,
          completed_todos,
          pending_todos,
          total_categories,
          category_distribution,
          priority_distribution,
          overdue_todos,
          upcoming_todos,
        },
      },
    };
  }

  return {
    status: 404,
    data: { detail: `Route not found: ${cleanUrl}` },
  };
}
