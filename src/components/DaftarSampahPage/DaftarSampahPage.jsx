import React, { useState, useEffect } from "react";
import styles from "./DaftarSampahPage.module.css";

const WasteCard = ({ listing }) => {
  const {
    sellerName,
    wasteType,
    estimatedWeightKg,
    imageUrl,
    sellerPhone,
    createdAt,
  } = listing;

  const handleContact = () => {
    const phone = sellerPhone.startsWith("0")
      ? "62" + sellerPhone.substring(1)
      : sellerPhone;
    const message = `Halo ${sellerName}, saya tertarik dengan postingan sampah ${wasteType} Anda di Aplikasi Cinunuk Lestari.`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className={styles.card}>
      <img
        className={styles.cardImage}
        src={
          imageUrl ||
          "https://placehold.co/400x400/e2e8f0/64748b?text=Tanpa+Gambar"
        }
        alt={`Sampah ${wasteType}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/400x400/e2e8f0/64748b?text=Gagal+Muat";
        }}
      />
      <div className={styles.cardContent}>
        <p className={styles.cardDate}>
          {createdAt
            ?.toDate()
            .toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
        <h3 className={styles.cardTitle}>{wasteType}</h3>
        <p className={styles.cardText}>
          Estimasi:{" "}
          <span className={styles.cardTextBold}>{estimatedWeightKg} kg</span>
        </p>
        <p className={styles.cardText}>
          Penjual: <span className={styles.cardTextBold}>{sellerName}</span>
        </p>
        <div className={styles.cardFooter}>
          <button onClick={handleContact} className={styles.contactButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.waIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.828 8.828 0 01-4.32-1.142L2 18l1.142-3.678A8.963 8.963 0 012 10c0-4.418 4.03-8 9-8s8 3.582 8 8zM7.34 16.142c.22-.1.43-.22.63-.35.2-.13.4-.26.58-.4.2-.13.38-.27.55-.42.18-.15.34-.3.5-.47.16-.17.3-.34.44-.53.14-.18.26-.38.37-.58.1-.2.18-.4.25-.6.07-.2.12-.4.15-.6.03-.2.05-.4.05-.6 0-.2-.02-.4-.05-.6s-.08-.38-.15-.56c-.07-.18-.16-.36-.28-.52s-.25-.3-.4-.44c-.15-.13-.3-.26-.48-.36s-.37-.2-.58-.27c-.2-.08-.4-.13-.6-.16-.2-.04-.4-.05-.6-.05-.2 0-.4.02-.58.05-.2.03-.38.08-.55.13-.17.06-.33.13-.48.2-.15.08-.28.17-.4.26-.12.1-.23.2-.32.3-.1.1-.18.2-.25.3-.07.1-.13.2-.18.3-.05.1-.08.2-.1.3s-.05.18-.05.27c0 .1.02.18.05.26.03.08.08.16.13.24.05.08.1.15.18.22.07.07.15.14.22.2.08.07.16.13.24.18.08.05.16.1.25.14.08.04.17.08.26.1.1.03.18.05.28.06.1.02.2.02.3 0 .1 0 .2 0 .28-.02.1-.02.18-.04.26-.06.08-.04.15-.08.22-.1.07-.06.14-.1.2-.14.07-.04.13-.08.18-.1.05-.03.1-.05.14-.06.04-.01.08-.2.1-.02.04 0 .08 0 .1.02.03 0 .05.02.08.02.02 0 .04.02.06.03.02.01.04.02.06.04.02.01.03.03.05.04.02.02.03.04.04.06.02.02.02.05.03.07.01.02.02.05.02.08 0 .03-.01.06-.02.08-.01.03-.02.05-.04.08-.02.02-.04.05-.06.07-.02.02-.05.04-.08.06-.03.02-.06.04-.1.05-.03.02-.07.03-.1.04-.04.01-.08.02-.12.03-.04.01-.08.02-.13.02s-.1.01-.14.01c-.05 0-.1 0-.14-.01s-.08-.01-.12-.02c-.04-.01-.08-.02-.12-.03-.04-.01-.08-.02-.1-.04-.03-.01-.06-.02-.08-.04-.02-.01-.04-.03-.06-.04-.02-.02-.04-.03-.05-.05-.02-.02-.03-.04-.04-.06-.01-.02-.02-.04-.02-.06 0-.03.01-.06.02-.08.01-.03.02-.05.04-.08.02-.02.04-.05.06-.07.02-.02.05-.04.08-.06.03-.02.06-.04.1-.05.03-.02.07-.03.1-.04.04-.01.08-.02.12-.03.04-.01.08-.02.13-.02s.1-.01.14-.01z"
                clipRule="evenodd"
              />
            </svg>
            <span>Hubungi via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className={`${styles.card} ${styles.skeleton}`}>
    <div className={styles.skeletonImage}></div>
    <div className={styles.cardContent}>
      <div className={styles.skeletonText} style={{ width: "33%" }}></div>
      <div
        className={`${styles.skeletonText} ${styles.skeletonTitle}`}
        style={{ width: "75%" }}
      ></div>
      <div className={styles.skeletonText} style={{ width: "50%" }}></div>
      <div className={styles.skeletonText} style={{ width: "50%" }}></div>
      <div className={styles.skeletonButton}></div>
    </div>
  </div>
);

const DaftarSampahPage = ({ query, collection, orderBy, onSnapshot, db }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "waste_listings"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const listingsData = [];
        querySnapshot.forEach((doc) => {
          listingsData.push({ id: doc.id, ...doc.data() });
        });
        setListings(listingsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching listings: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, collection, orderBy, onSnapshot, db]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <h2 className={styles.pageTitle}>Daftar Sampah Tersedia</h2>
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Daftar Sampah Tersedia</h2>
      {listings.length === 0 ? (
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className={styles.emptyTitle}>Belum ada postingan</h3>
          <p className={styles.emptyText}>
            Warga belum ada yang memposting sampah untuk dijual.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {listings.map((listing) => (
            <WasteCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DaftarSampahPage;
