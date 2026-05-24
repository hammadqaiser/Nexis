import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { UserPlus, Shield } from "lucide-react";
import bcrypt from "bcryptjs";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function createUser(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  });

  revalidatePath("/admin/users");
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1>Staff Management</h1>
          <p>Manage franchise managers and riders</p>
        </div>
      </div>

      <div className="admin-details-grid">
        
        {/* Left Col: Users List */}
        <div>
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} style={{ color: '#3b82f6' }} /> Active Users
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                            {user.name.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 500, color: '#fff' }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#d4d4d4' }}>{user.email}</td>
                      <td>
                        <span className={`admin-badge ${
                          user.role === 'ADMIN' ? 'purple' : 
                          user.role === 'FRANCHISE' ? 'primary' : 'success'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ color: '#a3a3a3', fontSize: '12px' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Add User Form */}
        <div>
          <div className="admin-card">
            <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: 'none', marginBottom: '24px' }}>
              <UserPlus size={20} style={{ color: '#3b82f6' }} /> Add New User
            </h2>
            <form action={createUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required type="text" name="name" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input required type="email" name="email" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input required type="password" name="password" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select required name="role" className="form-input" style={{ paddingLeft: '12px' }}>
                  <option value="FRANCHISE">Franchise Manager</option>
                  <option value="RIDER">Rider</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <button type="submit" className="admin-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                Create Account
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
