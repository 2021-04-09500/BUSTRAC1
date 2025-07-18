"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/users/search/search";
import styles from "@/app/ui/dashboard/users/users.module.css";
import Link from "next/link";
import { fetchUsers, deleteUser } from "@/app/services/userService";
import { FaEye, FaTrashAlt } from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNo: string; 
  role: string;
}

interface SearchProps {
  placeholder: string;
  onSearch: (term: string) => void;
}

const UsersPage = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (err: any) {
        setError(err.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((user) => user.role === roleFilter);

  const searchedUsers = searchTerm
    ? filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredUsers;

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(event.target.value);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id, userToDelete.role);
        setUsers(users.filter((user) => user.id !== userToDelete.id));
      } catch (err: any) {
        setError(err.message || "Failed to delete user.");
      } finally {
        setShowDeletePopup(false);
        setUserToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setUserToDelete(null);
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search
          placeholder={"Search for a user..."}
          onSearch={handleSearchChange}
        />
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Add User</button>
        </Link>
      </div>

      <div className={styles.filter}>
        <select
          value={roleFilter}
          onChange={handleRoleChange}
          className={styles.select}
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Parent">Parent</option>
          <option value="Conductor">Conductor</option>
          <option value="Student">Student</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone No</th> 
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNo}</td> 
              <td>{user.role}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/users/${user.role.toLowerCase()}/${user.id}`}>
                    <FaEye className={styles.viewIcon} />
                  </Link>
                  <FaTrashAlt
                    className={styles.deleteIcon}
                    onClick={() => handleDeleteClick(user)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeletePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>
              Are you sure you want to delete {userToDelete?.name} ({userToDelete?.role})?
            </p>
            <div className={styles.popupButtons}>
              <button className={styles.confirmButton} onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className={styles.cancelButton} onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Pagination />
    </div>
  );
};

export default UsersPage;