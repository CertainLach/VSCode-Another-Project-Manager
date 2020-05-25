# Change Log

All notable changes to the "another-project-manager" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [2.0.0]

### Added

* `another-project-manager.json` schema validation and completion
* "Add current workspace" action
* "Create directory" action

### Changed

* Proper `contextValue`, broken entries now have no actions
* To exclude conflicts, renamed config from `projects.json` to `another-project-manager.json`

### Removed

* Project `type` field is replaced with icon
* Non-working "Delete entry" action

## [1.0.1]

### Fixed

* Extension now works in empty workspaces

### Changed

* Extension type is UI now, so it's gui is available in remote workspaces

## [1.0.0] - Original

* Initial release, based on original extension files converted to typescript (as original source code is removed from github)
