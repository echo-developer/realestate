<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject // Implement JWTSubject interface
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'users';
    protected $fillable = [
        'name',
        'user_type',
        'email',
        'password',
        'phone',
        'image',
        'whatsapp_no',
        'phone_code',
        'status',
        'created_at',
        'updated_at'
    ];

    public function userAdditional()
    {
        return $this->hasOne(UserAdditional::class, 'user_id', 'id');
    }

    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // The unique identifier (usually the primary key)
    }

    /**
     * Get custom claims for the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return []; // You can add custom claims here if needed
    }


    public function createMemberUser(array $data)
    {

        $user = DB::table($this->table)->insert([
            'name' => $data['user_name'],
            'user_type' => $data['user_type'],
            'email' => $data['user_email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['user_phone'],
            'image' => $data['image'],
            'whatsapp_no' => $data['wp_num'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        set_flash_message('add');

        return [
            'message' => 'User Member added successfully.',
            'user' => $user
        ];
    }

    public function getMemberUsers($term = null, $paginate, $typeKey = null,)
    {
        $query = DB::table('users')
            ->where([
                ['users.status', '!=', config('constants.STATUS_DELETE')],
            ]);

        if ($term) {
            $query->where('users.name', 'like', "%{$term}%");
        }
        if ($typeKey) {
            $query->where('users.user_type', 'like', $typeKey);
        }
        return $query->paginate($paginate);
    }

    public function getMemberUsersDetails($id)
    {
        $MemberUsers = DB::table('users')
            ->where('users.id', '=', $id)
            ->select(
                'users.id',
                'users.name',
                'users.user_type',
                'users.phone',
                'users.status',
                'users.email',
                'users.image',
                'users.user_type',
                'users.whatsapp_no'
            )
            ->get();

        return $MemberUsers;
    }
    public function updateMemberUser($data, $id)
    {
        // Start a transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Update the category data in the users table
            $user = DB::table($this->table)
                ->where('id', $id)
                ->update([
                    'name' => $data['user_name'],
                    'user_type' => $data['user_type'],
                    'email' => $data['user_email'],
                    'password' => Hash::make($data['password']),
                    'phone' => $data['user_phone'],
                    'image' => $data['image'],
                    'whatsapp_no' => $data['wp_num'],
                    'status' => $data['status'],
                    'updated_at' => now(),
                ]);

            // Commit the transaction
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'MemberUser updated successfully.',
                'user' => $user
            ];
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }


    public function MemberUserStatusUpdate($data)
    {
        DB::table('users')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'category status updated.',
        ];
    }
    public function DeleteMemberUser($id = '')
    {
        DB::table('users')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        set_flash_message('delete');
        return [
            'message' => 'category deleted successfully.',
        ];
    }
}
