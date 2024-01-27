# Fault-tolerant quantum computation

Throughout this survey, we predominantly restrict our attention to the circuit model of quantum computation. Within this paradigm, any quantum algorithm can be expressed as a sequence of basic operations, such as product state preparation, unitary single- and two-qubit gates, and single-qubit Pauli measurements. In order to accurately determine complete end-to-end resource estimates for quantum algorithms it is essential to understand the costs of: (i) decomposing quantum algorithms into basic operations and (ii) realizing these basic operations reliably with the physical hardware. In other parts of this survey we assume noiseless logical qubits and operations (unless otherwise noted) and focus on item (i). In this section, we take into account that physical qubits and operations are noisy and discuss item (ii). We first review the fundamental ideas behind the theory of fault tolerance. We then illustrate them with concrete realizations in the paradigm of the surface code and lattice surgery.





