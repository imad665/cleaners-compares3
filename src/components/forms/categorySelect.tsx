'uae client'
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 

interface CategorySelectorProps {
  categoryLevel1: string;
  categoryLevel2: string;
  categoryLevel3: string;
  onCategoryLevel1Change: (category: string) => void;
  onCategoryLevel2Change: (category: string) => void;
  onCategoryLevel3Change: (category: string) => void;
}

// Mock data - in a real app this would come from an API
const categoryData = {
  "New Machines": ["Laundry", "Dry Cleaning", "Finishing Equipment", "Other New Machines"],
  "Used Machines": ["Laundry", "Dry Cleaning", "Finishing Equipment", "Other Used Machines"],
  "Parts": ["Washer Parts", "Dryer Parts", "Ironer Parts", "Chemical Dispenser Parts", "Other Parts"],
  "Sundries": ["Chemicals", "Packaging", "Tools", "Other Sundries"],
  "Services": ["Installation", "Maintenance", "Training", "Consulting", "Other Services"]
};

const level3Categories: Record<string, string[]> = {
  "Laundry": ["Washers", "Tumble Dryers", "Ironers", "Folders", "Other Laundry"],
  "Dry Cleaning": ["Spotting Stations", "Dry Cleaning Machines", "Press Machines", "Other Dry Cleaning"],
  "Finishing Equipment": ["Vacuum Tables", "Irons", "Presses", "Other Finishing"],
  "Washer Parts": ["Bearings", "Motors", "Control Boards", "Door Seals", "Other Washer Parts"],
  "Dryer Parts": ["Heating Elements", "Belts", "Thermostats", "Timers", "Other Dryer Parts"]
};

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categoryLevel1,
  categoryLevel2,
  categoryLevel3,
  onCategoryLevel1Change,
  onCategoryLevel2Change,
  onCategoryLevel3Change
}) => {
  const [level2Options, setLevel2Options] = useState<string[]>([]);
  const [level3Options, setLevel3Options] = useState<string[]>([]);
  
  useEffect(() => {
    if (categoryLevel1) {
      setLevel2Options(categoryData[categoryLevel1] || []);
      onCategoryLevel2Change(''); // Reset level 2 when level 1 changes
      onCategoryLevel3Change(''); // Reset level 3 when level 1 changes
    } else {
      setLevel2Options([]);
    }
  }, [categoryLevel1, onCategoryLevel2Change, onCategoryLevel3Change]);
  
  useEffect(() => {
    if (categoryLevel2) {
      setLevel3Options(level3Categories[categoryLevel2] || []);
      onCategoryLevel3Change(''); // Reset level 3 when level 2 changes
    } else {
      setLevel3Options([]);
    }
  }, [categoryLevel2, onCategoryLevel3Change]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="category-level-1">Main Category</Label>
        <Select value={categoryLevel1} onValueChange={onCategoryLevel1Change}>
          <SelectTrigger id="category-level-1">
            <SelectValue placeholder="Select main category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(categoryData).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category-level-2">
          Subcategory
          {!categoryLevel1 && <span className="text-xs text-muted-foreground ml-2">(Select main category first)</span>}
        </Label>
        <Select 
          value={categoryLevel2} 
          onValueChange={onCategoryLevel2Change}
          disabled={!categoryLevel1}
        >
          <SelectTrigger id="category-level-2">
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            {level2Options.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category-level-3">
          Detailed Category
          {(!categoryLevel1 || !categoryLevel2 || level3Options.length === 0) && 
            <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
          }
        </Label>
        <Select 
          value={categoryLevel3} 
          onValueChange={onCategoryLevel3Change}
          disabled={!categoryLevel2 || level3Options.length === 0}
        >
          <SelectTrigger id="category-level-3">
            <SelectValue placeholder="Select detailed category" />
          </SelectTrigger>
          <SelectContent>
            {level3Options.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CategorySelector;