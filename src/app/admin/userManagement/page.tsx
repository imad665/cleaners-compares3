'use client'
import { useEffect, useState } from 'react';
import { Search, Filter, Edit2, Trash2, Lock, Mail, UserX, UserCheck, Eye } from 'lucide-react';
import Badge from '@/components/adminDashboard/shared/Badge';
import Button from '@/components/adminDashboard/shared/Button';
import Table from '@/components/adminDashboard/shared/Table';
import { toast } from 'sonner';
import { SellerInfoDialog } from './SellerInfoDialog';


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  lastLogin: string;
  verified: boolean;
  password: string,
  isSignIn: boolean,
  products_count: number,
  wantedItems_count: number,
  BusinessForSale_count: number,
  sellerProfile: any;
}

const UserManagement = () => {
  // Mock users data
  let [usersData, setUsersData] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'seller',
      status: 'active',
      joined: '2023-01-15',
      lastLogin: '2023-05-18',
      verified: true
    },
    {
      id: '2',
      name: 'Emma Johnson',
      email: 'emma.j@example.com',
      role: 'buyer',
      status: 'active',
      joined: '2023-02-22',
      lastLogin: '2023-05-16',
      verified: true
    },
    {
      id: '3',
      name: 'Michael Davis',
      email: 'michael.d@example.com',
      role: 'seller',
      status: 'suspended',
      joined: '2023-03-10',
      lastLogin: '2023-04-28',
      verified: true
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      role: 'buyer',
      status: 'active',
      joined: '2023-03-15',
      lastLogin: '2023-05-17',
      verified: true
    },
    {
      id: '5',
      name: 'David Moore',
      email: 'david.m@example.com',
      role: 'seller',
      status: 'active',
      joined: '2023-04-02',
      lastLogin: '2023-05-10',
      verified: true
    },
    {
      id: '6',
      name: 'Jennifer Lee',
      email: 'jennifer.l@example.com',
      role: 'buyer',
      status: 'inactive',
      joined: '2023-04-18',
      lastLogin: '2023-04-20',
      verified: false
    },
    {
      id: '7',
      name: 'Robert Taylor',
      email: 'robert.t@example.com',
      role: 'seller',
      status: 'active',
      joined: '2023-04-25',
      lastLogin: '2023-05-15',
      verified: true
    },
    {
      id: '8',
      name: 'Lisa Brown',
      email: 'lisa.b@example.com',
      role: 'seller',
      status: 'pending',
      joined: '2023-05-05',
      lastLogin: 'Never',
      verified: false
    },
    {
      id: '9',
      name: 'James Wilson',
      email: 'james.w@example.com',
      role: 'buyer',
      status: 'active',
      joined: '2023-05-12',
      lastLogin: '2023-05-17',
      verified: true
    },
    {
      id: '10',
      name: 'Patricia Miller',
      email: 'patricia.m@example.com',
      role: 'buyer',
      status: 'inactive',
      joined: '2023-05-14',
      lastLogin: '2023-05-14',
      verified: true
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userActionType, setUserActionType] = useState<'delete' | 'suspend' | 'activate' | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/userManagement');
        if (!res.ok) {
          const { error } = await res.json();
          toast.error(error);
          return;
        }
        const { users } = await res.json();
        console.log(users);
        //setUsersData(users)

        setFilteredUsers(users);
        setUsersData(users)
      } catch (error) {
        toast.error('failed to fetch users')
      } finally {
        setLoading(false);
      }

    }
    fetchUsers();

  }, [refresh])
  useEffect(() => {
    applyFilters();
  }, [usersData, searchTerm, roleFilter, statusFilter]);

  // Apply filters to users
  const applyFilters = () => {
    let filtered = usersData;

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
    setFilteredUsers(usersData);
  };

  // Table columns configuration 

  const columns = [
    {
      header: 'User',
      accessor: (user: User) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            <div className="text-xs text-gray-500 max-w-50 overflow-hidden">
              <span className='text-blue-400 block'>password: </span>{user.password}
            </div>
            {!user.isSignIn && <span className='text-red-400 font-bold text-sm'>sign in failed</span>}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (user: User) => (
        <div>
          <Badge
            variant={user.role === 'seller' ? 'primary' : user.role === 'admin' ? 'success' : 'secondary'}
            rounded
          >
            {user.role === 'seller' ? 'Seller' : user.role === 'admin' ? 'ADMIN' : 'Buyer'}

          </Badge>
          {(user.role === 'admin' || user.role === 'seller') && <div className='text-xs'>
            <span>Products:{user.products_count}</span>
            <br />
            <span>Wanted items:{user.wantedItems_count}</span>
            <br />
            <span>Businesses For Sale:{user.BusinessForSale_count}</span>
          </div>}


        </div>

      ),
    },
    {
      header: 'Status',
      accessor: (user: User) => {
        const getStatusVariant = () => {
          switch (user.status) {

            case 'active': {
              if (!user.isSignIn) {
                user.status = 'inactive'
                return 'danger'
              }
              return 'success'
            };
            case 'suspended': return 'danger';
            default: return 'secondary';
          }
        };

        return (
          <Badge variant={getStatusVariant()}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Badge>
        );
      },
    },


    {
      header: 'Joined',
      accessor: 'joined',
    },
    /* {
      header: 'Last Login',
      accessor: 'lastLogin',
    }, */
  ];

  // Handle user actions
  const handleViewUser = (user: User) => {
    console.log('View user:', user);
    // Navigate to user detail view
  };

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // Navigate to edit user form
  };

  const openActionModal = (user: User, actionType: 'delete' | 'suspend' | 'activate') => {
    setSelectedUser(user);
    setUserActionType(actionType);
    setShowDeleteModal(true);
  };

  const confirmAction = async () => {
    if (selectedUser && userActionType) {
      console.log(`${userActionType} user:`, selectedUser);
      // Perform action based on userActionType

      if (userActionType === 'delete') {
        try {
          const res = await fetch('/api/admin/userManagement', {
            method: 'DELETE',
            body: JSON.stringify({ id: selectedUser.id })
          });
          if (!res.ok) {
            toast.error('failed to delete user');
            return
          }
          toast.success('user deleted successfuly')
        } catch (error) {
          toast.error('failed to delete user');
        } finally {
          setRefresh(v => !v);
        }

      } else if (userActionType === 'suspend' || userActionType === 'activate') {
        try {
          const isSusp = userActionType === 'suspend';
          const res = await fetch('/api/admin/userManagement', {
            method: 'PATCH',
            body: JSON.stringify({
              ...selectedUser,
              status: isSusp ? 'SUSPENDED' : 'ACTIVE'
            })
          })
          if (!res.ok) {
            toast.error(`failed to ${isSusp ? "suspend" : "activate"} user`);
            return
          }
          toast.success(`user ${isSusp ? "suspended" : "activated"} successfuly!`);
        } catch (error) {
          toast.error('something went wrong.')
        } finally {
          setRefresh(v => !v);
        }

      }

      setShowDeleteModal(false);
      setSelectedUser(null);
      setUserActionType(null);
    }
  };

  const handleSendEmail = (user: User) => {
    console.log('Send email to user:', user);
    // Open email composition interface
  };

  const handleResetPassword = (user: User) => {
    console.log('Reset password for user:', user);
    // Trigger password reset email
  };

  //console.log(filteredUsers);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users registered on your marketplace.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block p-3 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Roles</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>

              </select>
            </div>

            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <Button
                variant="primary"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      {loading ? <div className="flex justify-center mt-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div> :
        <Table
          columns={columns}
          data={filteredUsers}
          keyField="id"
          pagination={true}
          itemsPerPage={20}
          actions={(user: User) => (
            <div className="flex space-x-2 justify-end">
              <SellerInfoDialog
                seller={{ ...user, ...user.sellerProfile }}
              />
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendEmail(user);
                }}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title="Send Email"
              >
                <Mail size={18} />
              </button> */}
              {/* <button 
            onClick={(e) => {
              e.stopPropagation();
              handleResetPassword(user);
            }} 
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Reset Password"
          > 
            <Lock size={18} />
          </button> */}
              {user.status !== 'suspended' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openActionModal(user, 'suspend');
                  }}
                  className="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
                  title="Suspend User"
                >
                  <UserX size={18} />
                </button>
              ) : user.status === 'suspended' || user.status === 'inactive' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openActionModal(user, 'activate');
                  }}
                  className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                  title="Activate User"
                >
                  <UserCheck size={18} />
                </button>
              ) : null}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openActionModal(user, 'delete');
                }}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Delete User"
              >
                {/* <Trash2 size={18} /> */}
              </button>
            </div>
          )}
          onRowClick={handleViewUser}
        />
      }
      {/* Action Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 md:mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {userActionType === 'delete' ? 'Confirm Delete' :
                userActionType === 'suspend' ? 'Confirm Suspension' : 'Confirm Activation'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {userActionType === 'delete' && `Are you sure you want to delete the user "${selectedUser.name}"? This action cannot be undone.`}
              {userActionType === 'suspend' && `Are you sure you want to suspend the user "${selectedUser.name}"? They will not be able to log in or use the marketplace while suspended.`}
              {userActionType === 'activate' && `Are you sure you want to activate the user "${selectedUser.name}"? This will restore their access to the marketplace.`}
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                  setUserActionType(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={userActionType === 'delete' ? 'danger' : userActionType === 'suspend' ? 'warning' : 'success'}
                onClick={confirmAction}
              >
                {userActionType === 'delete' ? 'Delete' :
                  userActionType === 'suspend' ? 'Suspend' : 'Activate'}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className='w-[100vw] h-30'> </div>
    </div>
  );
};

export default UserManagement;