import { useEffect, useState, useCallback } from "react";

export const ADDDEPT = () => {
    const [deptData, setDeptData] = useState([]);
    const [deptName, setDeptName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            console.log("Retrieved token:", token); // Debugging log
            const response = await fetch("https://golang-proxy-server-production-9b2a.up.railway.app/departments", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDeptData(data.data);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to fetch departments: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            setMessage("Error fetching departments: " + error.message);
            console.log(message)
        } finally {
            setLoading(false);
        }
    }, [message]);

    const sendDepartment = async () => {
        if (!deptName) {
            setMessage("Department name cannot be empty.");
            return;
        }

        const formData = new FormData();
        formData.append("name", deptName);

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("dhttps://golang-proxy-server-production-9b2a.up.railway.app/departments", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`The department "${data.data}" was added!`);
                setDeptName(""); // Clear input field
                fetchDepartments(); // Refresh the department list
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add department: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            setMessage("Error adding department: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteDepartment = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`dhttps://golang-proxy-server-production-9b2a.up.railway.app/departments/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });

            if (response.ok) {
                setMessage("Department was deleted.");
                fetchDepartments(); // Refresh the department list
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete department: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            setMessage("Error deleting department: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = useCallback(async (username, password) => {
        try {
            const response = await fetch("dhttps://golang-proxy-server-production-9b2a.up.railway.app/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }), // try postform
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                console.log("Token stored:", data.token); // Debugging log
                fetchDepartments();
            } else {
                const errorData = await response.json();
                setMessage(`Login failed: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            setMessage("Error during login: " + error.message);
        }
    }, [fetchDepartments]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            handleLogin("32847fndskjfhkj432847fndskjfhkjds", "32847fn$@^%HDKJHSDdskjfhkj"); // Replace with real credentials for testing
        } else {
            fetchDepartments();
        }
    }, [fetchDepartments, handleLogin]);

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 border border-gray-300">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">ادارة الاقسام</h2>
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="اسم القسم"
                    value={deptName}
                    onChange={(event) => setDeptName(event.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={sendDepartment}
                    disabled={loading}
                    className={`p-3 text-white rounded-r-lg ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600 transition duration-200"}`}
                >
                    {loading ? "...جار الاضافة" : "اضافة"}
                </button>
            </div>
        
            <h3 className="mt-6 text-lg font-semibold text-gray-800">:الاقسام</h3>
            {loading ? (
                <p className="text-gray-500 text-center">...جار التحميل</p>
            ) : (
                <ul className="mt-2">
                    {deptData.map((dept) => (
                        <li key={dept.id} className="flex justify-between items-center border-b py-2 text-gray-700">
                            <button
                                onClick={() => deleteDepartment(dept.id)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                            >
                                حذف
                            </button>
                            <span>{dept.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
