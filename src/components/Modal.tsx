import styles from "./Modal.module.css";

export default function Modal({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay}>
			<div className={styles.modal} data-TestId="modal">
				<button
					className={styles.closeButton}
					type="button"
					onClick={onClose}
					data-TestId="modal-close"
				>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
}
