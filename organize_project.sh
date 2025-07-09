#!/bin/bash
# Project Structure Organizer Script
# Run from project root: ./organize_project.sh

# Set dry_run to false by default
dry_run=false

# Check for --dry-run argument
if [[ "$1" == "--dry-run" ]]; then
  dry_run=true
  echo "Running in dry-run mode. No changes will be made."
fi

# Function to execute a command or print it in dry-run mode
execute_command() {
  if [ "$dry_run" = true ]; then
    echo "DRY RUN: $1"
  else
    echo "Executing: $1"
    eval "$1"
  fi
}


# 1. Create the new directory structure
echo "🔨 Creating new directory structure..."
execute_command "mkdir -p src/components/{ui,shared} src/hooks/{auth,data,ui}"

# 2. Move components to appropriate folders (example patterns - customize these)
echo "🚚 Moving components..."
execute_command "mv src/components/Button.* src/components/ui/ 2>/dev/null"
execute_command "mv src/components/Modal.* src/components/ui/ 2>/dev/null"
execute_command "mv src/components/Header.* src/components/shared/ 2>/dev/null"
execute_command "mv src/components/Footer.* src/components/shared/ 2>/dev/null"

# 3. Move hooks to appropriate folders
echo "🚚 Moving hooks..."
execute_command "mv src/hooks/useAuth.* src/hooks/auth/ 2>/dev/null"
execute_command "mv src/hooks/useDataFetch.* src/hooks/data/ 2>/dev/null"
execute_command "mv src/hooks/useModal.* src/hooks/ui/ 2>/dev/null"

# 4. Update import paths automatically
echo "🔄 Updating import paths..."

# Component import updates
find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec bash -c '
  for file do
    if [ "$dry_run" = true ]; then
      echo "DRY RUN: sed -i \"\" \"
        s|@/components/Button|@/components/ui/Button|g;
        s|@/components/Modal|@/components/ui/Modal|g;
        s|@/components/Header|@/components/shared/Header|g;
        s|@/components/Footer|@/components/shared/Footer|g;
      \" \"$file\""
    else
      echo "Executing: sed -i \"\" \"
        s|@/components/Button|@/components/ui/Button|g;
        s|@/components/Modal|@/components/ui/Modal|g;
        s|@/components/Header|@/components/shared/Header|g;
        s|@/components/Footer|@/components/shared/Footer|g;
      \" \"$file\""
      sed -i '' "
        s|@/components/Button|@/components/ui/Button|g;
        s|@/components/Modal|@/components/ui/Modal|g;
        s|@/components/Header|@/components/shared/Header|g;
        s|@/components/Footer|@/components/shared/Footer|g;
      " "$file"
    fi
  done
' bash {} +

# Hook import updates
find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec bash -c '
  for file do
    if [ "$dry_run" = true ]; then
      echo "DRY RUN: sed -i \"\" \"
        s|@/hooks/useAuth|@/hooks/auth/useAuth|g;
        s|@/hooks/useDataFetch|@/hooks/data/useDataFetch|g;
        s|@/hooks/useModal|@/hooks/ui/useModal|g;
      \" \"$file\""
    else
      echo "Executing: sed -i \"\" \"
        s|@/hooks/useAuth|@/hooks/auth/useAuth|g;
        s|@/hooks/useDataFetch|@/hooks/data/useDataFetch|g;
        s|@/hooks/useModal|@/hooks/ui/useModal|g;
      \" \"$file\""
      sed -i '' "
        s|@/hooks/useAuth|@/hooks/auth/useAuth|g;
        s|@/hooks/useDataFetch|@/hooks/data/useDataFetch|g;
        s|@/hooks/useModal|@/hooks/ui/useModal|g;
      " "$file"
    fi
  done
' bash {} +


# 5. Create index files for better imports
echo "📝 Creating index files..."

# Components index
if [ "$dry_run" = false ]; then
cat > src/components/ui/index.ts << 'EOL'
export * from './Button';
export * from './Modal';
// Add other UI component exports here
EOL
fi

if [ "$dry_run" = false ]; then
cat > src/components/shared/index.ts << 'EOL'
export * from './Header';
export * from './Footer';
// Add other shared component exports here
EOL
fi

# Hooks index
if [ "$dry_run" = false ]; then
cat > src/hooks/auth/index.ts << 'EOL'
export * from './useAuth';
// Add other auth hook exports here
EOL
fi

if [ "$dry_run" = false ]; then
cat > src/hooks/data/index.ts << 'EOL'
export * from './useDataFetch';
// Add other data hook exports here
EOL
fi

if [ "$dry_run" = false ]; then
cat > src/hooks/ui/index.ts << 'EOL'
export * from './useModal';
// Add other UI hook exports here
EOL
fi


# 6. Verify the new structure
echo "✅ Reorganization complete!"
echo "New structure:"
if [ "$dry_run" = false ]; then
  tree src/components src/hooks -L 2
fi

echo "Next steps:"
echo "1. Review the changes: git diff"
echo "2. Test your application thoroughly"
echo "3. Commit the changes: git add . && git commit -m 'Reorganized project structure'"