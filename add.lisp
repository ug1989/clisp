(defun add (x y) (+ x y))
(defun dbAdd (x y)
	(add (add x x) (add y y)))
(dbAdd 22 33)
/* helo back */
