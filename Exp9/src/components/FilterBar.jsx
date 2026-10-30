import React from 'react';
import { Search, RotateCcw, Filter, BookOpen } from 'lucide-react';
import { COURSE_OPTIONS } from '../data/defaultData';

export function FilterBar({
  searchInputRef,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  semesterFilter,
  onSemesterFilterChange,
  courseFilter,
  onCourseFilterChange,
  onResetFilters,
  isFiltered,
  matchCount,
}) {
  return (
    <div className="filter-bar" role="search" aria-label="Student Search and Multi-criteria Filters">
      {/* Search Input with useRef Focus */}
      <div className="search-box-wrapper">
        <label htmlFor="student-search-input" className="sr-only">
          Search student by name, ID, or course
        </label>
        <div className="search-input-container">
          <Search className="search-icon" size={17} aria-hidden="true" />
          <input
            ref={searchInputRef}
            id="student-search-input"
            type="text"
            className="search-input"
            placeholder="Search by student name, ID (e.g. STU101), or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search student by name, ID, or email"
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
            <Filter size={13} aria-hidden="true" /> Status:
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={String(s)}>
                Sem {s}
              </option>
            ))}
          </select>
        </div>

        {/* Course / Branch Filter */}
        <div className="select-wrapper">
          <label htmlFor="course-filter-select" className="filter-label">
            <BookOpen size={13} aria-hidden="true" /> Branch:
          </label>
          <select
            id="course-filter-select"
            className="select-input"
            value={courseFilter}
            onChange={(e) => onCourseFilterChange(e.target.value)}
          >
            <option value="All">All Branches</option>
            {COURSE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            className="btn btn-secondary btn-icon-text"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>Reset ({matchCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
