'use client'

export function ImageClient({ inquiry, isSeller }: any) {

    return (
        <img
            src={isSeller ? inquiry.buyer.image || "/user.png" : inquiry.seller.image || "/user.png"}
            alt="Buyer"
            className=" ml-3 w-10 h-10 rounded-full object-cover border text-center"
            onError={(e) => {
                (e.target as HTMLImageElement).src = "/user.png"
            }}
        />
    )
}