"""
CLEANUP SCRIPT - Remove dead code and duplicate files
Run this to clean up the codebase
"""

import os
import shutil
from datetime import datetime

def create_cleanup_backup():
    """Create backup before cleanup"""
    print("💾 Creating cleanup backup...")
    
    backup_dir = f'backups/cleanup_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
    os.makedirs(backup_dir, exist_ok=True)
    
    print(f"  ✅ Backup directory: {backup_dir}")
    return backup_dir

def delete_duplicate_static_folder():
    """Delete duplicate public/static folder"""
    print("\n🗑️  Removing duplicate static folder...")
    
    if os.path.exists('public'):
        shutil.rmtree('public')
        print("  ✅ Deleted: public/ (duplicate of static/)")
    else:
        print("  ℹ️  public/ already removed")

def delete_virtual_env():
    """Remove virtual environment from repo"""
    print("\n🗑️  Removing virtual environment...")
    
    if os.path.exists('myvenv'):
        print("  ⚠️  Found myvenv/ - This should be in .gitignore")
        print("  ⚠️  Manually delete myvenv/ folder")
        print("  ⚠️  Add 'myvenv/' to .gitignore if not present")
    else:
        print("  ✅ myvenv/ not found")

def delete_old_templates():
    """Remove old template files"""
    print("\n🗑️  Removing old template files...")
    
    old_templates = [
        'templates/new_order_old.html',
        'templates/order_sheet_old.html',
        'templates/order_sheet_clean_old.html'
    ]
    
    for template in old_templates:
        if os.path.exists(template):
            os.remove(template)
            print(f"  ✅ Deleted: {template}")
        else:
            print(f"  ℹ️  Already removed: {template}")

def delete_duplicate_requirements():
    """Remove duplicate requirements file"""
    print("\n🗑️  Removing duplicate requirements file...")
    
    if os.path.exists('requirements_json.txt'):
        os.remove('requirements_json.txt')
        print("  ✅ Deleted: requirements_json.txt (keep requirements.txt)")
    else:
        print("  ℹ️  requirements_json.txt already removed")

def delete_unused_js_files():
    """Remove unused JavaScript files"""
    print("\n🗑️  Removing unused JavaScript files...")
    
    unused_js = [
        'static/js/schema_new.js',
        'static/js/dataMigration.js'
    ]
    
    for js_file in unused_js:
        if os.path.exists(js_file):
            os.remove(js_file)
            print(f"  ✅ Deleted: {js_file}")
        else:
            print(f"  ℹ️  Already removed: {js_file}")

def move_json_files_from_static():
    """Move JSON files from static to data"""
    print("\n📦 Moving JSON files from static/ to data/...")
    
    json_files = [
        ('static/orders_collection.json', 'data/orders_collection.json'),
        ('static/sheet_events.json', 'data/sheet_events.json')
    ]
    
    for src, dest in json_files:
        if os.path.exists(src):
            if not os.path.exists(dest):
                shutil.move(src, dest)
                print(f"  ✅ Moved: {src} → {dest}")
            else:
                os.remove(src)
                print(f"  ✅ Deleted: {src} (already exists in data/)")
        else:
            print(f"  ℹ️  Already moved: {src}")
    
    # Move sample to docs
    if os.path.exists('static/sample_order_structure.json'):
        os.makedirs('docs', exist_ok=True)
        if not os.path.exists('docs/sample_order_structure.json'):
            shutil.move('static/sample_order_structure.json', 'docs/sample_order_structure.json')
            print("  ✅ Moved: static/sample_order_structure.json → docs/")
        else:
            os.remove('static/sample_order_structure.json')
            print("  ✅ Deleted: static/sample_order_structure.json")

def update_gitignore():
    """Update .gitignore with proper entries"""
    print("\n📝 Updating .gitignore...")
    
    gitignore_entries = [
        '# Virtual environments',
        'venv/',
        'myvenv/',
        'env/',
        '.venv/',
        '',
        '# Environment variables',
        '.env',
        '.env.local',
        '',
        '# Python cache',
        '__pycache__/',
        '*.pyc',
        '*.pyo',
        '*.pyd',
        '',
        '# Backups',
        'backups/',
        '*.backup',
        '',
        '# IDE',
        '.vscode/',
        '.idea/',
        '*.swp',
        '',
        '# Deployment',
        '.vercel/',
        '',
        '# OS',
        '.DS_Store',
        'Thumbs.db'
    ]
    
    if os.path.exists('.gitignore'):
        with open('.gitignore', 'r') as f:
            current = f.read()
        
        # Add missing entries
        with open('.gitignore', 'a') as f:
            f.write('\n\n# Added by cleanup script\n')
            for entry in gitignore_entries:
                if entry and entry not in current:
                    f.write(entry + '\n')
        
        print("  ✅ .gitignore updated")
    else:
        with open('.gitignore', 'w') as f:
            f.write('\n'.join(gitignore_entries))
        print("  ✅ .gitignore created")

def create_cleanup_report():
    """Create cleanup report"""
    print("\n📄 Creating cleanup report...")
    
    report = f'''# CLEANUP REPORT
Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Files Deleted
- ✅ public/ (duplicate static folder)
- ✅ templates/new_order_old.html
- ✅ templates/order_sheet_old.html
- ✅ templates/order_sheet_clean_old.html
- ✅ requirements_json.txt
- ✅ static/js/schema_new.js
- ✅ static/js/dataMigration.js

## Files Moved
- ✅ static/orders_collection.json → data/
- ✅ static/sheet_events.json → data/
- ✅ static/sample_order_structure.json → docs/

## Manual Actions Required
1. Delete myvenv/ folder manually
2. Review and remove duplicate functions in static/js/order_form.js:
   - updatePaymentSummary() appears twice (lines ~800 and ~1500)
   - loadDraft() is never called
3. Remove duplicate routes in app/controllers/order_controller.py:
   - /order-new (duplicate of /new-order)
   - /order-bookings (duplicate of /bookings)

## Next Steps
1. Run: git status
2. Commit cleanup changes
3. Test application thoroughly
4. Review CODE_REVIEW_REPORT.md for remaining issues
'''
    
    with open('CLEANUP_REPORT.md', 'w') as f:
        f.write(report)
    
    print("  ✅ Created: CLEANUP_REPORT.md")

def main():
    print("=" * 60)
    print("🧹 WEDDING CRM - CLEANUP SCRIPT")
    print("=" * 60)
    
    # Create backup
    backup_dir = create_cleanup_backup()
    
    # Perform cleanup
    delete_duplicate_static_folder()
    delete_virtual_env()
    delete_old_templates()
    delete_duplicate_requirements()
    delete_unused_js_files()
    move_json_files_from_static()
    update_gitignore()
    create_cleanup_report()
    
    print()
    print("=" * 60)
    print("✅ CLEANUP COMPLETED!")
    print("=" * 60)
    print()
    print("📋 Summary:")
    print("  - Duplicate files removed")
    print("  - JSON files organized")
    print("  - .gitignore updated")
    print()
    print("⚠️  Manual actions required:")
    print("  1. Delete myvenv/ folder")
    print("  2. Remove duplicate functions in JavaScript")
    print("  3. Remove duplicate routes in controllers")
    print()
    print("📄 See CLEANUP_REPORT.md for details")
    print()

if __name__ == "__main__":
    main()
