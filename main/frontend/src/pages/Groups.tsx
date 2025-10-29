// Page: Groups
// Purpose: Groups management and discovery page
import React, { useState, useEffect } from "react";
import GroupCard from "../components/Groups/GroupCard";
import GroupModal from "../components/Groups/GroupModal";
import type { Group } from "../types";

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // TODO: Fetch groups from API
    // For now, set empty array and loading false
    setLoading(false);
  }, []);

  const handleGroupSelect = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
    }
  };

  const handleModalClose = () => {
    setSelectedGroup(null);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="groups-header">
        <h1>Groups</h1>
        <p>Discover UCF RSOs and student organizations</p>
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="groups-grid">
        {loading ? (
          <p>Loading groups...</p>
        ) : filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={handleGroupSelect}
            />
          ))
        ) : (
          <p>No groups found</p>
        )}
      </div>

      {selectedGroup && (
        <GroupModal
          group={selectedGroup}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
