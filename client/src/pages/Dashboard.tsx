import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateLeadForm from "../components/CreateLeadForm";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    status: "New",
    source: "Website",
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leads");
      setLeads(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
    });
  };

  const handleUpdate = async () => {
    try {
      if (!editingLead) return;

      await api.put(`/leads/${editingLead._id}`, form);

      setEditingLead(null);
      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get("/leads/export/csv", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Export CSV
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <CreateLeadForm refreshLeads={fetchLeads} />

      {/* LEADS */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <h2 className="text-xl font-bold">{lead.name}</h2>
              <p>{lead.email}</p>
              <p>Status: {lead.status}</p>
              <p>Source: {lead.source}</p>

              <div className="flex gap-2 mt-4">

                {/* UPDATE BUTTON */}
                <button
                  onClick={() => openEdit(lead)}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg w-1/2"
                >
                  Update
                </button>

                {/* DELETE BUTTON (NOW FOR ALL USERS) */}
                <button
                  onClick={() => handleDelete(lead._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg w-1/2"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPDATE MODAL */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-xl font-bold mb-4">
              Update Lead
            </h2>

            <input
              className="border w-full p-2 mb-2"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              className="border w-full p-2 mb-2"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Email"
            />

            <select
              className="border w-full p-2 mb-2"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Lost</option>
            </select>

            <select
              className="border w-full p-2 mb-4"
              value={form.source}
              onChange={(e) =>
                setForm({ ...form, source: e.target.value })
              }
            >
              <option>Website</option>
              <option>Instagram</option>
              <option>Referral</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-1/2"
              >
                Save
              </button>

              <button
                onClick={() => setEditingLead(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg w-1/2"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;