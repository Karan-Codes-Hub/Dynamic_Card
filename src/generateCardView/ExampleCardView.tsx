// UsageExamples.tsx
import React, { useState, useRef } from 'react';
import 
type
{
  CardViewOptions,
  CardLayoutOptions,
  HeaderCardViewOptions,
  CardInteractions,
  DataItemDescription,
  PaginationConfig,
  CardFunctionalities, 
  CardLoaderProps 
} from './InterfacesForCardView';
import { Typography, Button, Avatar, Badge, IconButton, Box, MenuItem, FormControl, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Mail as MailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon
} from '@mui/icons-material';
import CardViewInterfacesMap from './interfaceMap/CardViewInterfacesMap';
import ValidateCardView from './validateCardView/ValidateCardView';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
// Sample employee data for demonstration
// const sampleData = [
//   {
//     id: '1',
//     name: 'John Doe',
//     role: 'Senior Developer',
//     avatar: '/path/to/avatar1.jpg',
//     email: 'john.doe@company.com',
//     phone: '+1 (555) 123-4567',
//     department: 'Engineering',
//     hireDate: '2020-05-15',
//     status: 'active',
//     rating: 4.8,
//     price: 1000,
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     role: 'UX Designer',
//     avatar: '/path/to/avatar2.jpg',
//     email: 'jane.smith@company.com',
//     phone: '+1 (555) 987-6543',
//     department: 'Design',
//     hireDate: '2021-02-10',
//     status: 'active',
//     rating: 4.9,
//     price: 211.11,
//   },
//   {
//     id: '3',
//     name: 'Michael Johnson',
//     role: 'Product Manager',
//     avatar: '/path/to/avatar3.jpg',
//     email: 'michael.johnson@company.com',
//     phone: '+1 (555) 222-3344',
//     department: 'Product',
//     hireDate: '2019-08-21',
//     status: 'inactive',
//     rating: 4.5,
//     price: 532.75,
//   },
//   {
//     id: '4',
//     name: 'Emily Davis',
//     role: 'Frontend Engineer',
//     avatar: '/path/to/avatar4.jpg',
//     email: 'emily.davis@company.com',
//     phone: '+1 (555) 111-2233',
//     department: 'Engineering',
//     hireDate: '2022-01-12',
//     status: 'active',
//     rating: 4.7,
//     price: 899.99,
//   },
//   {
//     id: '5',
//     name: 'David Wilson',
//     role: 'Backend Engineer',
//     avatar: '/path/to/avatar5.jpg',
//     email: 'david.wilson@company.com',
//     phone: '+1 (555) 333-4455',
//     department: 'Engineering',
//     hireDate: '2021-06-18',
//     status: 'active',
//     rating: 4.6,
//     price: 1200,
//   },
// ];
const generateData = (num : number) => {
  // Predefined arrays for generating realistic data
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'];
  const roles = ['Senior Developer', 'UX Designer', 'Product Manager', 'Frontend Engineer', 'Backend Engineer', 'Team Lead', 'Architect'];
  const statuses = ['active', 'inactive', 'on leave', 'terminated'];

  const data = [];

  // Generate the requested number of employee records
  for (let i = 1; i <= num; i++) {
    // Randomly select values from the predefined arrays
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate a random hire date within the last 5 years
    const hireDate = new Date();
    hireDate.setFullYear(hireDate.getFullYear() - Math.floor(Math.random() * 5));
    hireDate.setMonth(Math.floor(Math.random() * 12));
    hireDate.setDate(Math.floor(Math.random() * 28) + 1);

    // Construct the employee object with all required fields
    data.push({
      id: `emp-${1000 + i}`, // Unique ID with prefix
      name: `${firstName} ${lastName}`, // Full name
      role: role, // Job role
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Profile image
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`, // Email based on name
      phone: `+1-${Math.floor(200 + Math.random() * 800)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`, // Random phone number
      department: department, // Department assignment
      hireDate: hireDate.toISOString().split('T')[0], // Formatted date (YYYY-MM-DD)
      status: status, // Employment status
      rating: (Math.random() * 5).toFixed(1), // Rating between 0.0 and 5.0
      price: Math.floor(50000 + Math.random() * 150000) // Salary/price between 50K and 200K
    });
  }

  return data;
};
const sampleData = generateData(100);
const dataItemDescriptions: DataItemDescription[] = [
  {
    key: 'id',
    label: 'ID',
    typeOfField: 'string',
    sortConfiguration: { canSort: false },
    filterConfiguration: { canFilter: false },
    editableConfiguration: { isEditable: false }
  },
  {
    key: 'name',
    label: 'Full Name',
    typeOfField: 'string',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'text'
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'text',
      placeholder: 'Enter full name',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      onEdit: (id, newValue) => console.log(`Updating name for ${id} to ${newValue}`)
    }
  },
  {
    key: 'role',
    label: 'Role',
    typeOfField: 'string',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'text'
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'select',
      editorOptions: ['Senior Developer', 'UX Designer', 'Product Manager', 'Frontend Engineer', 'Backend Engineer', 'Team Lead', 'Architect'],
      placeholder: 'Select role',
      validation: { required: true },
      onEdit: (id, newValue) => console.log(`Updating role for ${id} to ${newValue}`)
    }
  },
  {
    key: 'avatar',
    label: 'Avatar',
    typeOfField: 'image',
    sortConfiguration: { canSort: false },
    filterConfiguration: { canFilter: false },
    editableConfiguration: {
      isEditable: true,
      editorType: 'file',
      placeholder: 'Upload avatar image',
      onEdit: (id, newValue) => console.log(`Updating avatar for ${id} to ${newValue}`)
    }
  },
  {
    key: 'email',
    label: 'Email Address',
    typeOfField: 'string',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'text'
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'text',
      placeholder: 'Enter email address',
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      onEdit: (id, newValue) => console.log(`Updating email for ${id} to ${newValue}`)
    }
  },
  {
    key: 'phone',
    label: 'Phone Number',
    typeOfField: 'string',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'text'
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'text',
      placeholder: 'Enter phone number',
      validation: {
        required: true,
        pattern: /^\+?[\d\s\-\(\)]+$/
      },
      onEdit: (id, newValue) => console.log(`Updating phone for ${id} to ${newValue}`)
    }
  },
  {
    key: 'department',
    label: 'Department',
    typeOfField: 'string',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'select',
      filterOptions: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR']
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'select',
      editorOptions: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'],
      placeholder: 'Select department',
      validation: { required: true },
      onEdit: (id, newValue) => console.log(`Updating department for ${id} to ${newValue}`)
    }
  },
  {
    key: 'hireDate',
    label: 'Hire Date',
    typeOfField: 'date',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'date'
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'date',
      placeholder: 'Select hire date',
      validation: { required: true },
      onEdit: (id, newValue) => console.log(`Updating hire date for ${id} to ${newValue}`)
    }
  },
  {
    key: 'status',
    label: 'Status',
    typeOfField: 'status',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'select',
      filterOptions: ['active', 'inactive', 'on leave', 'terminated']
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'radio',
      editorOptions: ['active', 'inactive', 'on leave', 'terminated'],
      validation: { required: true },
      onEdit: (id, newValue) => console.log(`Updating status for ${id} to ${newValue}`)
    }
  },
  {
    key: 'rating',
    label: 'Rating',
    typeOfField: 'number',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'range'
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'number',
      placeholder: 'Enter rating (0-5)',
      validation: {
        required: true,
        minValue: 0,
        maxValue: 5
      },
      onEdit: (id, newValue) => console.log(`Updating rating for ${id} to ${newValue}`)
    }
  },
  {
    key: 'price',
    label: 'Price',
    typeOfField: 'number',
    sortConfiguration: { canSort: true },
    filterConfiguration: {
      canFilter: true,
      filterType: 'range'
    },
    editableConfiguration: {
      isEditable: true,
      editorType: 'number',
      placeholder: 'Enter price',
      validation: {
        required: true,
        minValue: 0
      },
      onEdit: (id, newValue) => console.log(`Updating price for ${id} to ${newValue}`)
    }
  }
];

// Theme configuration for consistent styling
const theme = {
  colors: {
    primary: '#4361ee',
    secondary: '#3f37c9',
    accent: '#4895ef',
    danger: '#f72585',
    success: '#4cc9f0',
    light: '#f8f9fa',
    dark: '#212529',
    muted: '#6c757d',
    white: '#ffffff',
    border: '#e9ecef',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    pill: '50px',
  },
};

// Common header configuration shared across different views
const commonHeaderConfig: HeaderCardViewOptions = {
  visible: true,
  title: 'Employee Dashboard',
  style: { padding: '20px', backgroundColor: '#f8f9fa' },
  makeHeaderSticky: true,
  // customHeader: <div className='d-flex align-items-center gap-2 p-1'>Custom Header</div>,
  headerConfig: {
    defaultItems: {
      search: {
        visible: true,
        placeholder: 'Search employees...'
      },
      sort: {
        visible: true,
        multiSort: false
      },
      download: {
        visible: true,
        // allowedTypes: ['csv', 'json'],
        nameForDownloadFile: 'employees',
        // allowedColumnsToDownload: ['name', 'email', 'department'],
        // excludeColumnsFromDownload: ['avatar']
      },
      filter: true
    },
    defaultAlignment: 'right',

  }


};
/**
 * Default loader configuration
 * Can be used when no props are passed or to provide fallback values.
 */
export const DEFAULT_CARD_LOADER_CONFIG: CardLoaderProps = {
  variant: "pulse-circle",       // Default animation type
  size: "medium",           // Default loader size
  overlay: true,            // Show semi-transparent background overlay
  message: "Loading...",    // Default message under loader
  className: "",            // No extra CSS class by default
  style: {},                // No inline style overrides by default
};
// Common interaction settings for cards
const commonInteractions: CardInteractions = {
  selectable: false,
  multiSelect: false,
  onClick: (item) => console.log("Clicked:", item),
  // allowAnimations: false,
  onDoubleClick: (item) => console.log("Double Clicked:", item),
};

// Default layout configuration with responsive breakpoints
export const DEFAULT_LAYOUT_OPTIONS: CardLayoutOptions = {
  type: 'grid',
  columns: 4,
  gap: '24px',
  padding: '16px',

  // Grid layout options
  gridOptions: {
    minItemWidth: '350px',
    maxItemWidth: '1fr',
    autoFlow: 'auto-fit'
  },

  // Masonry layout options
  masonryOptions: {
    columnWidth: '300px',
    fitWidth: false,
    horizontalOrder: true,
    transitionDuration: '0.3s',
    stagger: '0.03s',
    resize: true,
    initLayout: true,
    originTop: true,
    originLeft: true,
    hiddenStyle: {
      opacity: 0,
      transform: 'scale(0.001)'
    },
    visibleStyle: {
      opacity: 1,
      transform: 'scale(1)'
    }
  },

  // Carousel layout options
  carouselOptions: {
    visibleCards: 3,
    infinite: true,
    autoPlay: 0,
    easing: 'ease-in-out',
    showArrows: true,
    showDots: true,
    arrowPosition: 'sides',
    dotPosition: 'bottom',
    responsive: [
      { breakpoint: 1200, settings: { visibleCards: 3 } },
      { breakpoint: 768, settings: { visibleCards: 2 } },
      { breakpoint: 480, settings: { visibleCards: 1 } }
    ],
    centerMode: false,
    centerPadding: '60px',
    swipe: true,
    touchThreshold: 5,
    dragThreshold: 5
  },

  // Stack layout options
  stackOptions: {
    offset: 20,
    scale: 0.95,
    rotation: 2,
    perspective: 1000,
    transitionDuration: '0.3s',
    easing: 'ease-in-out',
    maxVisible: 1,
    spread: false,
    spreadDirection: 'horizontal',
    peek: 0,
    interactive: true,
    draggable: false,
    threshold: 10,
    onSelect: undefined,
    onDeselect: undefined
  },

  // Responsive breakpoints for different screen sizes
  breakpoints: {
    1200: {
      columns: 3,
      gap: '20px',
      gridOptions: {
        minItemWidth: '280px'
      }
    },
    768: {
      columns: 2,
      gap: '16px',
      gridOptions: {
        minItemWidth: '250px'
      }
    },
    480: {
      columns: 1,
      gap: '12px',
      gridOptions: {
        minItemWidth: '100%'
      }
    }
  },

  className: '',
  style: {}
};

export const defaultPaginationConfig: Required<PaginationConfig> = {
  enabled: true,
  itemsPerPage: 10,
  variant: 'basic',
  showSizeChanger: false,
  pageSizeOptions: [
    { value: 10, label: '10 per page' },
    { value: 20, label: '20 per page' },
    { value: 30, label: '30 per page' },
  ],
  showTotal: false,
  showQuickJumper: false,
  align: 'center',
};

/**
 * Default View Configuration
 * Shows a simple grid view of employee cards with minimal configuration
 */
const defaultViewConfig: CardViewOptions = {
  dataMode: 'normal',
  data: sampleData,
  dataItemDescription: dataItemDescriptions,
  content: {
    contentDisplayType: 'default-view',
    content: {
      excludeKeys: ['id', 'avatar'] // Hide these fields from display
    }
  },
  layout: DEFAULT_LAYOUT_OPTIONS,
  cardStyle: {
    style: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
  },
  headerCardView: commonHeaderConfig,
  interactions: commonInteractions,
  renderCard: (item) => <div>Default card rendering</div>,
  paginationOptions: defaultPaginationConfig,
  cardLoaderProps: DEFAULT_CARD_LOADER_CONFIG
};

/**
 * Template View Configuration
 * Uses a custom HTML template with handlebars-style syntax for rendering
 */
const templateViewConfig: CardViewOptions = {
  dataMode: 'normal',
  data: sampleData,
  dataItemDescription: dataItemDescriptions,
  content: {
    contentDisplayType: 'template-config',
    content: {
      template: `
        <div style="padding: 16px; border-radius: 8px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 8px 0; color: #333;">{{name}}</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">{{role}}</p>
          <p style="margin: 8px 0; color: #888; font-size: 12px;">{{department}}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            <span style="color: #4361ee; font-weight: bold;">Rating: {{rating}}</span>
            <span style="color: #4caf50; font-size: 12px;">{{status}}</span>
          </div>
        </div>
      `,
      helpers: {
        formatPrice: (price: number) => `$${price.toFixed(2)}`
      }
    }
  },
  layout: DEFAULT_LAYOUT_OPTIONS,
  headerCardView: {
    ...commonHeaderConfig,
    title: 'Template View - Employees'
  },
  interactions: commonInteractions,
  renderCard: (item) => <div>Template card rendering</div>,
  paginationOptions: defaultPaginationConfig,
  cardLoaderProps: DEFAULT_CARD_LOADER_CONFIG

};

// Simplified mobile detection (in a real app, use a proper responsive hook)
const isMobile = false;

/**
 * Field Config View Configuration
 * Provides detailed control over each element's position and appearance
 * using a row-based layout system with left/center/right sections
 */
const fieldConfig: any = {
  dataMode: 'normal',
  data: sampleData,
  dataItemDescription: dataItemDescriptions,
  content: {
    contentDisplayType: 'field-config',
    content: {
      rows: [
        // Header row with avatar, name/title, and status
        {
          id: 'header-row',
          left: {
            elements: [
              {
                id: 'avatar',
                field: 'avatar',
                component: (value: string, item?: any) => (
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color="success"
                  >
                    <Avatar
                      src={value}
                      sx={{
                        width: 56,
                        height: 56,
                        border: `2px solid ${theme.colors.white}`,
                      }}
                    />
                  </Badge>
                ),
                style: { marginRight: '12px' }
              },
            ],
            justifyContent: 'flex-start',
            gap: '8px'
          },
          center: {
            elements: [
              {
                id: 'name-title',
                component: (item: any) => (
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.muted,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {item.role}
                      <StarIcon sx={{
                        color: '#ffc107',
                        fontSize: '1rem',
                        marginLeft: '4px'
                      }} />
                      <span style={{ fontWeight: 600 }}>{item.rating}</span>
                    </Typography>
                  </div>
                ),
                order: 1
              }
            ],
            flexDirection: 'column',
            gap: '8px',
            style: { flex: 1 }
          },
          right: {
            elements: [
              {
                id: 'status',
                field: 'status',
                component: (value: string, item?: any) => (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: value === 'active' ? '#4caf50' : '#f44336'
                    }}></div>
                    <Typography variant="caption" sx={{
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '0.5px'
                    }}>
                      {value}
                    </Typography>
                  </div>
                ),
                order: 1
              },
              {
                id: 'more-actions',
                component: (item: any) => (
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                ),
                order: 2
              }
            ],
            justifyContent: 'flex-end',
            gap: '16px'
          },
          containerStyle: {
            padding: '16px',
            borderBottom: `1px solid ${theme.colors.border}`
          }
        },
        // Contact information row with email and phone
        {
          id: 'contact-row',
          left: {
            elements: [
              {
                id: 'email',
                field: 'email',
                component: (value: string, item?: any) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        display: "flex",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MailIcon
                        sx={{
                          color: theme.colors.muted,
                          fontSize: "1rem",
                        }}
                      />
                    </div>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {value}
                    </Typography>
                  </div>
                ),
                order: 1
              }
            ],
            flexDirection: 'column',
            gap: '8px',
            style: { flex: 1 }
          },
          right: {
            elements: [
              {
                id: 'phone',
                field: 'phone',
                component: (value: string, item?: any) => (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <PhoneIcon sx={{
                      color: theme.colors.muted,
                      fontSize: '1rem'
                    }} />
                    <Typography variant="body2">
                      {value}
                    </Typography>
                  </div>
                ),
                order: 1
              }
            ],
            flexDirection: 'column',
            gap: '8px',
            style: { flex: 1 }
          },
          containerStyle: {
            padding: '16px',
            borderBottom: `1px solid ${theme.colors.border}`,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "8px" : "0px",
          }
        },
        // Details row with department and hire date
        {
          id: 'details-row',
          left: {
            elements: [
              {
                id: 'department',
                field: 'department',
                component: (value: string, item?: any) => (
                  <div>
                    <Typography variant="caption" sx={{
                      color: theme.colors.muted,
                      display: 'block'
                    }}>
                      Department
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {value}
                    </Typography>
                  </div>
                ),
                order: 1
              }
            ],
            style: { flex: 1 }
          },
          center: {
            elements: [
              {
                id: 'hire-date',
                field: 'hireDate',
                component: (value: string, item?: any) => (
                  <div>
                    <Typography variant="caption" sx={{
                      color: theme.colors.muted,
                      display: 'block'
                    }}>
                      Hire Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {value}
                    </Typography>
                  </div>
                ),
                order: 1
              }
            ],
            style: { flex: 1 }
          },
          containerStyle: {
            padding: '16px',
            borderBottom: `1px solid ${theme.colors.border}`
          }
        },
        // Actions row with edit and delete buttons
        {
          id: 'actions-row',
          center: {
            elements: [
              {
                id: 'edit-btn',
                component: (item: any) => (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon fontSize="small" />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: theme.borderRadius.pill
                    }}
                    onClick={() => alert(`Edit ${item.id}`)}
                  >
                    Edit
                  </Button>
                ),
                order: 1
              },
              {
                id: 'delete-btn',
                component: (item: any) => (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon fontSize="small" />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: theme.borderRadius.pill
                    }}
                    onClick={() => alert(`Delete ${item.id}`)}
                  >
                    Delete
                  </Button>
                ),
                order: 2
              }
            ],
            gap: '8px'
          },
          containerStyle: {
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'flex-end'
          }
        }
      ],
      cardStyle: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: theme.colors.white
      }
    }
  },
  layout: DEFAULT_LAYOUT_OPTIONS,
  interactions: commonInteractions,
  headerCardView: {
    ...commonHeaderConfig,
    title: 'Team Members (Field Config View)',
    additionalActions: [
      <Button
        key="add-member"
        variant="contained"
        sx={{ borderRadius: theme.borderRadius.pill }}
      >
        Add New Member
      </Button>
    ]
  },
  renderCard: (item) => <div>Field config card rendering</div>,
  paginationOptions: defaultPaginationConfig,
  cardLoaderProps: DEFAULT_CARD_LOADER_CONFIG
};

/**
 * Segregated Data Configuration
 * Organizes data into collapsible sections with separate headers
 */
const segregatedConfig: any = {
  dataMode: 'segregated',
  dataItemDescription: dataItemDescriptions,
  segregatedData: {
    globalHeader: {
      title: 'Employee Dashboard',
      visible: true,
      style: { padding: '20px', backgroundColor: '#f8f9fa' }
    },
    sections: [
      {
        id: 'personal-info',
        header: 'Personal Information',
        data: sampleData[0],
        content: {
          contentDisplayType: 'field-config',
          content: {
            rows: [
              {
                id: 'basic-info',
                left: {
                  elements: [
                    {
                      id: 'name',
                      field: 'name',
                      component: (value: string) => (
                        <Typography variant="h6">{value}</Typography>
                      )
                    }
                  ]
                }
              }
            ]
          }
        },
        collapsible: true,
        initiallyCollapsed: false
      },
      {
        id: 'contact-info',
        header: 'Contact Information',
        data: sampleData[0],
        content: {
          contentDisplayType: 'field-config',
          content: {
            rows: [
              {
                id: 'contact-details',
                left: {
                  elements: [
                    {
                      id: 'email',
                      field: 'email',
                      component: (value: string) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MailIcon sx={{ color: '#666', fontSize: '1rem' }} />
                          <Typography variant="body2">{value}</Typography>
                        </div>
                      )
                    },
                    {
                      id: 'phone',
                      field: 'phone',
                      component: (value: string) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <PhoneIcon sx={{ color: '#666', fontSize: '1rem' }} />
                          <Typography variant="body2">{value}</Typography>
                        </div>
                      )
                    }
                  ],
                  flexDirection: 'column'
                }
              }
            ]
          }
        },
        collapsible: true,
        initiallyCollapsed: false
      }
    ],
    globalStyle: {
      fontFamily: 'Arial, sans-serif'
    }
  },
  layout: DEFAULT_LAYOUT_OPTIONS,
  renderCard: (item) => <div>Segregated card rendering</div>,
};

// View type options for the dropdown
const VIEW_TYPES = {
  DEFAULT: 'default',
  TEMPLATE: 'template',
  FIELD_CONFIG: 'field-config',
  SEGREGATED: 'segregated'
} as const;

type ViewType = keyof typeof VIEW_TYPES;

// View configuration mapping
const viewConfigs: Record<ViewType, CardViewOptions> = {
  DEFAULT: defaultViewConfig,
  TEMPLATE: templateViewConfig,
  FIELD_CONFIG: fieldConfig,
  SEGREGATED: segregatedConfig
};

// View descriptions for the dropdown
const viewDescriptions: Record<ViewType, string> = {
  DEFAULT: 'Default View - Simple grid with minimal configuration',
  TEMPLATE: 'Template View - Custom HTML template with handlebars syntax',
  FIELD_CONFIG: 'Field Config View - Detailed control over layout elements',
  SEGREGATED: 'Segregated View - Data organized into collapsible sections'
};

/**
 * Main Card View Example Component
 * Demonstrates different card view configurations with a dropdown selector
 */
const ExampleCardView: React.FC = () => {

  const [selectedView, setSelectedView] = useState<ViewType>('DEFAULT');
  const refForFunctionalities = useRef<CardFunctionalities>(null);
  const handleViewChange = (event: SelectChangeEvent<ViewType>) => {
    setSelectedView(event.target.value as ViewType);
  };
  console.log("refForFunctionalitiesInMain", refForFunctionalities.current);
  const [selectedToggle, setSelectedToggle] = useState<any>("CARD");

  const handleToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewType | null
  ) => {
    if (newView !== null) {
      setSelectedToggle(newView);
    }
  };
  const renderSelectedView = () => {
    const config = viewConfigs[selectedView];
    return (
      <ValidateCardView
        key={selectedView}
        options={config}
        ref={refForFunctionalities}
      />
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Card View Examples
        </Typography>
        <Button onClick={() => refForFunctionalities.current.updateOptionsForCardView.updatePagination({ enabled: false })}>Don't allow paginations</Button>
        <Button onClick={() => refForFunctionalities.current.cardLoader.showCardLoader("emp-1001")}>Load Card</Button>
        <FormControl sx={{ minWidth: 300 }}>
          <Select
            value={selectedView}
            onChange={handleViewChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select view type' }}
          >
            {Object.entries(VIEW_TYPES).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {viewDescriptions[key as ViewType]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ToggleButtonGroup
          value={selectedView}
          exclusive
          onChange={handleToggleChange}
          aria-label="view type toggle"
        >
          <ToggleButton value="CARD" aria-label="card view">
            Card
          </ToggleButton>
          <ToggleButton value="MAP" aria-label="map view">
            Map
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          Current View: {viewDescriptions[selectedView]}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Use the dropdown above to switch between different card view configurations.
        </Typography>
      </Box>


      <Box>
        <AnimatePresence mode="wait">
          {selectedToggle === "CARD" && (
            <motion.div
              key="card-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSelectedView()}
            </motion.div>
          )}

          {selectedToggle === "MAP" && (
            <motion.div
              key="map-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardViewInterfacesMap />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      <Box sx={{ mt: 4, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          View Type Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Default View:</strong> Simple grid layout showing basic employee information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Template View:</strong> Custom HTML template with dynamic data binding
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Field Config View:</strong> Advanced layout control with row-based configuration
        </Typography>
        <Typography variant="body2">
          <strong>Segregated View:</strong> Data organized into expandable/collapsible sections
        </Typography>
      </Box>
      {/* <CardViewInterfacesMap /> */}
    </div>
  );
};

export default ExampleCardView;