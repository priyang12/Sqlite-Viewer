#! /bin/bash

# variables
Path="src/Components"

# Take User Input for Creating Component or deleting Component
echo "Enter 1 to create Components"
echo "Enter 2 to delete Components"
read choice

Rfce() {
     # Define the path for the new component file
    local component_path="$Path/$1/$1.tsx"
    
    # Create the new component file and write the component template
    echo "import React from 'react';" >>"$component_path"
    echo " " >>"$component_path"
    echo "const $1: React.FC = () => {" >>"$component_path"
    echo "    return (" >>"$component_path"
    echo "        <div>" >>"$component_path"
    echo "            $1" >>"$component_path"
    echo "        </div>" >>"$component_path"
    echo "    );" >>"$component_path"
    echo "};" >>"$component_path"
    echo "export default $1;" >>"$component_path"
}

Test() {
    # Test Boilerplate
    echo "import { render, screen } from '@testing-library/react';" >>$Path/$1/$1.test.tsx
    echo "import '@testing-library/jest-dom/vitest';" >>$Path/$1/$1.test.tsx
    echo "import $1 from './$1';" >>$Path/$1/$1.test.tsx
    echo " " >>$Path/$1/$1.test.tsx
    echo "    it('should render Component', () => {" >>$Path/$1/$1.test.tsx
    echo "        render(<$1 />);" >>$Path/$1/$1.test.tsx
    echo "    });" >>$Path/$1/$1.test.tsx
    
}

Index() {
    # index.tsx
    echo "export { default } from './$1';" >>$Path/$1/index.tsx
}

# if user input is 1 then create Component

if [ "$choice" -eq 1 ]; then
    echo "Creating Component"
    read -p "Enter Component Name: " NAME

    if [ -z "$NAME" ]; then
        echo "You did not Component Name"
    else

        echo "Component Name: $NAME"


        if [ ! -d "$Path/$NAME" ]; then
            # touch src/Components/Form/{Form.js,Form.test.js,Form.css}
            mkdir -p $Path/$NAME
            
            # Write in BoilerPlate
            Rfce $NAME
            Test $NAME
            Index $NAME

            echo "Component Created"
        else
            echo "Component Already Exists"
        fi

    fi

else

    echo "Deleting Component"
    read -p "Enter Component Name: " NAME
    rm -rf $Path/$NAME
fi