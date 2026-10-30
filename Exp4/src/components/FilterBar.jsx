import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

/**
 * FilterBar Component
 * - Receives searchInputRef (useRef) to autofocus search field on page load
 * - Controlled input state managed by parent via useState
 */
export function FilterBar({
  searchInputRef,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  semesterFilter,
  onSemesterFilterChange,
  onResetFilters,
  isFiltered,
  matchCount,
}) {
  return (
    <div className="filter-bar" role="search" aria-label="Student Search and Filters">
      <div className="search-box-wrapper">
        <label htmlFor="student-search-input" className="sr-only">
          Search student by name or ID
        </label>
        <div className="search-input-container">
          <Search className="search-icon" size={18} aria-hidden="true" />
          <input
            ref={searchInputRef}
            id="student-search-input"
            type="text"
            className="search-input"
            placeholder="Search student by name or ID (e.g. STU101)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search student by name or ID"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="filter-controls-group">
        {/* Status Filter */}
        <div className="select-wrapper">
          <label htmlFor="status-filter-select" className="filter-label">
            <Filter size={14} aria-hidden="true" /> Status:
          </label>
          <select
            id="status-filter-select"
            className="select-input"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="Needs Attention">Needs Attention</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>

        {/* Semester Filter */}
        <div className="select-wrapper">
          <label htmlFor="semester-filter-select" className="filter-label">
            Semester:
          </label>
          <select
            id="semester-filter-select"
            className="select-input"
            value={semesterFilter}
            onChange={(e) => onSemesterFilterChange(e.target.value)}
          >
            <option value="All">All Semesters</option>
            <option value="1">Sem 1</option>
            <option value="2">Sem 2</option>
            <option value="3">Sem 3</option>
            <option value="4">Sem 4</option>
            <option value="5">Sem 5</option>
            <option value="6">Sem 6</option>
            <option value="7">Sem 7</option>
            <option value="8">Sem 8</option>
          </select>
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <button
            type="button"
            className="btn btn-secondary btn-icon-text"
            onClick={onResetFilters}
            title="Reset all search queries and dropdown filters"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Reset ({matchCount} found)</span>
          </button>
        )}
      </div>
    </div>
  );
}
