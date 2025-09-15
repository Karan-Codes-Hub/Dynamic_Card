import React, { useState } from 'react';
import { Pagination,Space,  Card, Input } from 'antd';
import {
  FastBackwardOutlined,
  FastForwardOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { usePagination } from '../customHooks/usePagination'

// TypeScript Interfaces
interface PageSizeOption {
  value: number;
  label: string;
}

interface PaginationLocale {
  jumpTo?: string;
  page?: string;
  itemsPerPage?: string;
  total?: string;
  range?: string;
}

type SizeType = 'small' | 'middle' | 'large' | undefined;

interface AdvancedPaginationProps {
  // Basic props
  current?: number;
  defaultCurrent?: number;
  total: number;
  pageSize?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  
  // Display controls
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean | ((total: number, range: [number, number]) => React.ReactNode);
  showPageInput?: boolean;
  showPageControls?: boolean;
  
  // Customization
  pageSizeOptions?: PageSizeOption[];
  disabled?: boolean;
  simple?: boolean;
  responsive?: boolean;
  hideOnSinglePage?: boolean;
  align?: 'left' | 'center' | 'right';
  
  // Advanced features
  showBoundaryJumper?: boolean;
  
  // Style
  size?: SizeType;
  style?: React.CSSProperties;
  className?: string;
  
  // Localization
  locale?: PaginationLocale;
  
  // Icons
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  jumpPrevIcon?: React.ReactNode;
  jumpNextIcon?: React.ReactNode;
  
  // Custom renderers
  itemRender?: (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: React.ReactNode
  ) => React.ReactNode;
}

export const AdvancedPagination: React.FC<any> = (props) => {
  const {
    // Basic props
    current: controlledCurrent,
    defaultCurrent = 1,
    total = 0,
    pageSize: controlledPageSize,
    defaultPageSize = 10,
    onChange,
    onShowSizeChange,
    
    // Display controls
    showSizeChanger = true,
    showQuickJumper = true,
    showTotal = true,
    showPageInput = false,
    showPageControls = true,
    
    // Customization
    pageSizeOptions = [
      { value: 10, label: '10 / page' },
      { value: 20, label: '20 / page' },
      { value: 50, label: '50 / page' },
      { value: 100, label: '100 / page' }
    ],
    disabled = false,
    simple = false,
    responsive = false,
    hideOnSinglePage = false,
    align = 'center',
    
    // Advanced features
    showBoundaryJumper = false,
    
    // Style
    size = 'small',
    style = {},
    className = '',
    
    // Localization
    locale = {
      jumpTo: 'Jump to',
      page: 'Page',
      itemsPerPage: 'items per page',
      total: 'Total items',
      range: 'of'
    },
    
    // Icons
    prevIcon = <LeftOutlined />,
    nextIcon = <RightOutlined />,
    jumpPrevIcon = <FastBackwardOutlined />,
    jumpNextIcon = <FastForwardOutlined />,
    
    // Custom renderers
    itemRender,
    
    ...restProps
  } = props;
  console.log("props", props);
  // Use the pagination hook
  const pagination = usePagination({
    // current: controlledCurrent,
    defaultCurrent,
    pageSize: controlledPageSize,
    defaultPageSize,
    total,
    onChange,
    onShowSizeChange
  });

  // Don't render if hiding on single page and there's only one page
  if (hideOnSinglePage && pagination.totalPages <= 1) {
    return null;
  }
  
  // Alignment style
  const alignmentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: align === 'left' ? 'flex-start' : 
                  align === 'right' ? 'flex-end' : 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  };
  
  // Custom item renderer if not provided
  const defaultItemRender = (
    currentPage: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: React.ReactNode
  ): React.ReactNode => {
    if (type === 'prev') {
      return React.cloneElement(prevIcon as React.ReactElement, { 
        style: { fontSize: '12px' } 
      });
    }
    if (type === 'next') {
      return React.cloneElement(nextIcon as React.ReactElement, { 
        style: { fontSize: '12px' } 
      });
    }
    if (type === 'jump-prev') {
      return React.cloneElement(jumpPrevIcon as React.ReactElement, { 
        style: { fontSize: '12px' } 
      });
    }
    if (type === 'jump-next') {
      return React.cloneElement(jumpNextIcon as React.ReactElement, { 
        style: { fontSize: '12px' } 
      });
    }
    return originalElement;
  };

  // Render total text
  const renderTotalText = () => {
    if (typeof showTotal === 'function') {
      return showTotal(total, [pagination.startItem, pagination.endItem]);
    }
    
    if (showTotal === true) {
      return (
        <span className="pagination-total">
          {locale.total}: {total} {total > 0 && `(${pagination.startItem}-${pagination.endItem})`}
        </span>
      );
    }
    
    return null;
  };
  console.log("paginationi",  pagination);

  return (
    <div style={{ ...alignmentStyle, ...style }} className={className}>
      <Space direction={responsive ? "vertical" : "horizontal"} size="middle">
        {/* Total display */}
        {renderTotalText()}
        
        {/* Boundary jumpers */}
        {showBoundaryJumper && pagination.totalPages > 2 && (
          <Space>
            <FastBackwardOutlined 
              onClick={disabled ? undefined : pagination.handleJumpToStart}
              style={{ 
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: disabled ? '#ccc' : 'inherit',
                opacity: pagination.current === 1 ? 0.5 : 1
              }}
            />
            <FastForwardOutlined 
              onClick={disabled ? undefined : pagination.handleJumpToEnd}
              style={{ 
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: disabled ? '#ccc' : 'inherit',
                opacity: pagination.current === pagination.totalPages ? 0.5 : 1
              }}
            />
          </Space>
        )}
        
        {/* The main pagination component */}
        <Pagination
          current={props.currentPage}
          total={total}
          pageSize={props.pageSize}   
          onChange={pagination.handleChange}
          onShowSizeChange={pagination.handleSizeChange}
          showSizeChanger={showSizeChanger && !simple}
          showQuickJumper={false} // We'll implement our own quick jumper
          disabled={disabled}
          simple={simple}
          responsive={responsive}
          size={"small"}
          pageSizeOptions={pageSizeOptions.map(opt => opt.value)}
          itemRender={itemRender || defaultItemRender}
          showPrevNextJumpers={!simple}
          {...restProps}
        />
        
        {/* Custom quick jumper implementation */}
        {showQuickJumper && !simple && (
          <Space>
            <span>{locale.jumpTo}</span>
            <Input
              value={pagination.quickJumperValue}
              onChange={pagination.handleQuickJumperChange}
              onPressEnter={pagination.handleQuickJumperPressEnter}
              disabled={disabled}
              size={size}
              style={{ width: 60 }}
              type="number"
              min={1}
              max={pagination.totalPages}
            />
          </Space>
        )}
      </Space>
    </div>
  );
};

// Example usage component (unchanged)
export const AdvancedPaginationDemo: React.FC = (props) => {
  console.log("props", props);
  const [current, setCurrent] = useState(3);
  const [pageSize, setPageSize] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  
  const handleChange = (page: number, size: number) => {
    console.log('Page: ', page, 'PageSize: ', size);
    setCurrent(page);
    if (size) {
      setPageSize(size);
    }
  };
  
  return (
    <div style={{ padding: 24 }}>
      <Card 
        // title="Advanced Pagination Component" 
        // extra={
        //   <Switch 
        //     checked={showSettings} 
        //     onChange={setShowSettings}
        //     checkedChildren="Hide Settings"
        //     unCheckedChildren="Show Settings"
        //   />
        // }
      >
        {/* {showSettings && (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <div>
                  <strong>Current Page:</strong> {current}
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <strong>Page Size:</strong> {pageSize}
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <strong>Total Items:</strong> 500
                </div>
              </Col>
            </Row>
            <Divider />
          </>
        )}
         */}
        {/* <AdvancedPagination
          current={current}
          pageSize={pageSize}
          total={500}
          onChange={handleChange}
          onShowSizeChange={handleChange}
          showSizeChanger={true}
          showQuickJumper={true}
          showTotal={true}
          showBoundaryJumper={true}
          locale={{
            jumpTo: 'Go to',
            page: 'Page',
            itemsPerPage: 'items per page',
            total: 'Total',
            range: 'of'
          }}
          align="center"
          style={{ padding: '16px 0' }}
        />
         */}
        {/* {showSettings && (
          <>
            <Divider>Alternative Configurations</Divider> */}
            
            {/* <h3>Left Aligned</h3> */}
            <AdvancedPagination
              total={85}
              showSizeChanger={true}
              pageSizeOptions={[
                { value: 5, label: '5 per page' },
                { value: 15, label: '15 per page' },
                { value: 30, label: '30 per page' },
                { value: 50, label: '50 per page' }
              ]}
              showTotal={true}
              showQuickJumper={false}
              align="center"
            />
            
            {/* <h3>Simple Mode</h3>
            <AdvancedPagination
              total={200}
              simple={true}
            />
            
            <h3>Disabled State</h3>
            <AdvancedPagination
              total={200}
              disabled={true}
            />
            
            <h3>Custom Page Size Options</h3>
            <AdvancedPagination
              total={250}
              pageSizeOptions={[
                { value: 5, label: '5 per page' },
                { value: 15, label: '15 per page' },
                { value: 30, label: '30 per page' },
                { value: 50, label: '50 per page' }
              ]}
            />
          </>
        )} */}
      </Card>
    </div>
  );
};