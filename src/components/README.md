# README.md

## Purpose

Contains presentation-focused React components that render data supplied by `src/lib`.

## Public entrypoints

- `CopyButton`
- `InstallBanner`
- `MarkdownRenderer`
- `SkillCard`
- `SkillGrid`

## Dependency rules

- Components may depend on `src/lib` for typed helpers and simple selectors.
- Components should not perform repository fetch orchestration or route resolution.

## Extension guidance

- Keep components declarative and prop-driven.
- Extract reusable UI behavior only when it serves multiple renderers.

## PlantUML

```plantuml
@startuml
class CopyButton
class InstallBanner
class MarkdownRenderer
class SkillCard
class SkillGrid
class CommandService
class SkillFilterService
class SkillIconService

InstallBanner --> CommandService
MarkdownRenderer ..> ReactMarkdown : uses
SkillCard --> CommandService
SkillCard --> SkillIconService
SkillGrid --> SkillFilterService
@enduml
```
